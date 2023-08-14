import schedule from 'node-schedule';

interface ScheduledTask {
    id: string;
    cronExpression: string;
    action: () => void;
}

const scheduledTasks: { [taskId: string]: schedule.Job } = {};

export function scheduleTask(task: ScheduledTask): void {
    const { id, cronExpression, action } = task;

    const job = schedule.scheduleJob(id, cronExpression, () => {
        console.log(`Executing task ${id}`);
        action(); // Perform the actual action here
    });

    scheduledTasks[id] = job;
}

export function unscheduleTask(id: string): boolean {
    const job = scheduledTasks[id];
    if (job) {
        job.cancel();
        delete scheduledTasks[id];
        return true;
    }
    return false;
}
