package com.dailypulse.backend.schedular;


import com.dailypulse.backend.Quote.model.Status;
import com.dailypulse.backend.Quote.repo.QuoteRepo;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PublishScheduledQuoteJob implements Job {

    @Autowired
    private QuoteRepo quoteRepo;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        // get the quoteId passed when the job was scheduled
        Long quoteId = context.getJobDetail()
                .getJobDataMap()
                .getLong("quoteId");

        quoteRepo.findById(quoteId).ifPresent(quote -> {
            quote.setStatus(Status.PUBLISHED);
            quote.setScheduledAt(null);   // clear scheduled time after publishing
            quoteRepo.save(quote);
            System.out.println("Quote " + quoteId + " published by scheduler.");
        });
    }
}