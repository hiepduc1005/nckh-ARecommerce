package com.ecommerce.vn.config;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.Nullable;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer{
    private static final Logger logger = LoggerFactory.getLogger(AsyncConfig.class);

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Số thread tối thiểu luôn sẵn sàng
        executor.setCorePoolSize(5);
        
        // Số thread tối đa
        executor.setMaxPoolSize(20);
        
        // Kích thước queue chờ
        executor.setQueueCapacity(100);
        
        // Tên prefix cho thread
        executor.setThreadNamePrefix("Async-");
        
        // Thời gian thread idle trước khi bị destroy (seconds)
        executor.setKeepAliveSeconds(60);
        
        // Policy khi thread pool đầy
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        // Chờ tất cả task hoàn thành khi shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);
        
        // Thời gian chờ tối đa khi shutdown (seconds)
        executor.setAwaitTerminationSeconds(60);
        
        executor.initialize();
        
        logger.info("Async TaskExecutor initialized with corePoolSize={}, maxPoolSize={}, queueCapacity={}", 
                   executor.getCorePoolSize(), executor.getMaxPoolSize(), executor.getQueueCapacity());
        
        return executor;
    }
    
    @Override
	@Nullable
	public Executor getAsyncExecutor() {
    	 return taskExecutor();
	}

	@Override
	@Nullable
	public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            logger.error("Async method {} threw exception: {}", method.getName(), throwable.getMessage(), throwable);
        };

	}

	
}
