import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-3',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <div className={`animate-spin rounded-full border-primary-600 dark:border-primary-400 border-t-transparent ${sizeClasses[size]}`}></div>
            {text && (
                <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm">{text}</p>
            )}
        </motion.div>
    );
};

export default LoadingSpinner;
