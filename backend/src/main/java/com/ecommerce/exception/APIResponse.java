package com.ecommerce.exception;

import java.util.Objects;

public class APIResponse {
    private String message;
    private boolean status;

    public APIResponse() {
    }

    public APIResponse(String message, boolean status) {
        this.message = message;
        this.status = status;
    }

    // Getter cho `message`
    public String getMessage() {
        return message;
    }

    // Setter cho `message`
    public void setMessage(String message) {
        this.message = message;
    }

    // Getter cho `status`
    public boolean isStatus() {
        return status;
    }

    // Setter cho `status`
    public void setStatus(boolean status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "APIResponse{" +
                "message='" + message + '\'' +
                ", status=" + status +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        APIResponse that = (APIResponse) o;
        return status == that.status && message.equals(that.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message, status);
    }
}
