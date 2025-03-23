package com.petsitting.controller;

import com.petsitting.dto.RequestDto;
import com.petsitting.model.RequestStatus;
import com.petsitting.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {
    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<RequestDto> createRequest(
        @Valid @RequestBody RequestDto requestDto,
        @AuthenticationPrincipal Long userId
    ) {
        return ResponseEntity.ok(requestService.createRequest(requestDto, userId));
    }

    @GetMapping
    public ResponseEntity<Page<RequestDto>> getRequests(
        @RequestParam(required = false) RequestStatus status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
        Pageable pageable
    ) {
        return ResponseEntity.ok(requestService.getRequests(status, startDate, endDate, pageable));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<RequestDto>> getNearbyRequests(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(defaultValue = "10000") Double distanceInMeters
    ) {
        return ResponseEntity.ok(requestService.getNearbyRequests(latitude, longitude, distanceInMeters));
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<RequestDto> acceptRequest(
        @PathVariable Long requestId,
        @AuthenticationPrincipal Long userId
    ) {
        return ResponseEntity.ok(requestService.acceptRequest(requestId, userId));
    }
} 