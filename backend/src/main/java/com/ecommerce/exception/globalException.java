package com.ecommerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;


@RestControllerAdvice
public class globalException {
    
    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<APIResponse> myResourceNotFoundException(ResourceNotFoundException e) {
		String message = e.getMessage();

		APIResponse res = new APIResponse(message, false);

		return new ResponseEntity<APIResponse>(res, HttpStatus.NOT_FOUND);
	}

    
}
