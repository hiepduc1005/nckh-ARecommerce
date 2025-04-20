package com.ecommerce.vn.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý validation errors
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, Object> errors = new HashMap<>();
//        errors.put("timestamp", LocalDateTime.now());
//        errors.put("status", HttpStatus.BAD_REQUEST);
//        errors.put("error", "Validation Failed");
//        
//        Map<String, String> fieldErrors = new HashMap<>();
//        ex.getBindingResult().getFieldErrors().forEach(error -> 
//            fieldErrors.put(error.getField(), error.getDefaultMessage())
//        );
//        errors.put("details", fieldErrors);
//        
//       return new ResponseEntity<Map<String,Object>>(errors, HttpStatus.BAD_REQUEST);
//    }
//
//    // Xử lý constraint violations
//    @ExceptionHandler(ConstraintViolationException.class)
//    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
//        Map<String, Object> errors = new HashMap<>();
//        errors.put("timestamp", LocalDateTime.now());
//        errors.put("status", HttpStatus.BAD_REQUEST.value());
//        errors.put("error", "Constraint Violation");
//       
//        errors.put("details", ex.getMessage());
//        
//        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
//    }
//
//    // Xử lý ResourceNotFoundException (custom exception)
//    @ExceptionHandler(ResourceNotFoundException.class)
//    @ResponseStatus(HttpStatus.NOT_FOUND)
//    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
//        Map<String, Object> errors = new HashMap<>();
//        errors.put("timestamp", LocalDateTime.now());
//        errors.put("status", HttpStatus.NOT_FOUND.value());
//        errors.put("error", "Resource Not Found");
//        errors.put("message", ex.getMessage());
//        
//        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
//    }
//
//    // Xử lý tất cả các exception khác
//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Map<String, Object>> handleAllUncaughtException(Exception ex) {
//        Map<String, Object> errors = new HashMap<>();
//        errors.put("timestamp", LocalDateTime.now());
//        errors.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
//        errors.put("error", "Internal Server Error");
//        errors.put("message", "An unexpected error occurred");
//        
//        return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
}
