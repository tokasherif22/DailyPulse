package com.dailypulse.backend.schedular;

import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.model.Quote;
import com.dailypulse.backend.Quote.model.Status;
import com.dailypulse.backend.Quote.repo.QuoteRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

// QuoteSchedulerService.java
@Service
@RequiredArgsConstructor
public class QuoteSchedulerService {

    private final Scheduler scheduler;   // injected by Spring Boot Quartz starter

    @Autowired
    QuoteRepo quoteRepo;

    @Autowired
    ModelMapper modelMapper;

    public void scheduleQuotePublishing(Long quoteId, LocalDateTime scheduledAt) throws SchedulerException {

        // convert LocalDateTime to Date for Quartz
        Date triggerTime = Date.from(
                scheduledAt.atZone(ZoneId.systemDefault()).toInstant()
        );

        // job detail — what to run
        JobDetail jobDetail = JobBuilder.newJob(PublishScheduledQuoteJob.class)
                .withIdentity("publishQuote_" + quoteId, "quotes")
                .usingJobData("quoteId", quoteId)   // pass quoteId to the job
                .build();

        // trigger — when to run it
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger_" + quoteId, "quotes")
                .startAt(triggerTime)               // fires once at scheduledAt
                .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                .build();


        scheduler.scheduleJob(jobDetail, trigger);

        System.out.println("Quote " + quoteId + " scheduled for " + scheduledAt);
    }

    // QuoteService.java — add reschedule method
    public QuoteResponse rescheduleQuote(Long id, LocalDateTime newScheduledAt, String email) {

        Quote quote = quoteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        // cancel old job first
        try {
            this.cancelScheduledQuote(id);
        } catch (SchedulerException e) {
            System.out.println("No existing job to cancel for quote " + id);
        }

        // set new scheduled time
        quote.setScheduledAt(newScheduledAt);
        quote.setStatus(Status.SCHEDULED);
        quoteRepo.save(quote);

        // register new job
        try {
            this.scheduleQuotePublishing(id, newScheduledAt);
        } catch (SchedulerException e) {
            throw new RuntimeException("Failed to reschedule: " + e.getMessage());
        }

        return modelMapper.map(quote, QuoteResponse.class);
    }

    // cancel if user deletes or reschedules
    private void cancelScheduledQuote(Long quoteId) throws SchedulerException {
        scheduler.deleteJob(JobKey.jobKey("publishQuote_" + quoteId, "quotes"));
        System.out.println("Cancelled schedule for quote " + quoteId);
    }



}
