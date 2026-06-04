export interface Quote {

  id: number;

  text: string;

  createdBy: string;

  createdAt: string;

  isAIGenerated: boolean;

  scheduledAt: string;

  status: 'DRAFT' | 'PUBLISHED';

  topic : [

  //  'MOTIVATION',

  // 'SUCCESS',

  // 'PRODUCTIVITY',

  // 'LEADERSHIP',

  // 'FITNESS',

  // 'MINDSET',
  //  'DISCIPLINE',

  //   'HAPPINESS',

  //   'GRATITUDE',

  //   'BUSINESS'

];
}