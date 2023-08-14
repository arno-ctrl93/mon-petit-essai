
import { Request, Response } from 'express';
import * as scheduler from '../helper/scheduler.misc'

async function scheduleTask(req: Request, res: Response) {
    const { id, cronExpression, text } = req.body;

    scheduler.scheduleTask({
        id,
        cronExpression,
        action: () => {
            console.log(text);
        },
    });

    res.json({ message: 'Task scheduled successfully' });
}

async function unscheduleTask(req: Request, res: Response) {
    const { id } = req.body;

    const success = scheduler.unscheduleTask(id);
    if (success) {
        res.json({ message: 'Task unscheduled successfully' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
}

export default {
    scheduleTask,
    unscheduleTask,
}