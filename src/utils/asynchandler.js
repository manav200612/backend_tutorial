const asynchandeler = (fn) => async (req,res,next) => {
    try {
        await fn(req,res,next);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
}

export {asynchandeler}