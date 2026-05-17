package com.nomow.company_screener.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CompanyNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleNotFound(CompanyNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody(ex.getMessage(), 404));
  }

  @ExceptionHandler(AiServiceException.class)
  public ResponseEntity<Map<String, Object>> handleAiError(AiServiceException ex) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorBody(ex.getMessage(), 503));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(errorBody("An unexpected error occurred", 500));
  }

  private Map<String, Object> errorBody(String message, int status) {
    return Map.of(
            "timestamp", LocalDateTime.now().toString(),
            "status", status,
            "error", message
    );
  }
}