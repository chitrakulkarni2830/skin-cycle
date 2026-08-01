import cron from 'node-cron';
import { InventoryItem } from '../models/InventoryItem.js';

export const startCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily reorder reminder job...');
    try {
      const today = new Date();
      
      const items = await InventoryItem.find({
        reorderReminderSent: false,
        estimatedDepletionDate: { $ne: null }
      });

      for (const item of items) {
        const daysUntilDepletion = (item.estimatedDepletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysUntilDepletion <= item.reorderThresholdDays) {
          item.reorderReminderSent = true;
          await item.save();
          console.log(`Reminder marked for item ${item._id} (User: ${item.userId})`);
        }
      }
      console.log('Daily reorder reminder job completed.');
    } catch (error) {
      console.error('Error in reorder reminder job:', error);
    }
  });
};
