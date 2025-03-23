package com.petsitting.dto;

import com.petsitting.model.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestDto {
    private Long id;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    @NotBlank(message = "Pet type is required")
    private String petType;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotBlank(message = "Location is required")
    private String location;

    private Long ownerId;
    private String ownerName;
    private Long sitterId;
    private String sitterName;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 