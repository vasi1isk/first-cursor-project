package com.petsitting.service;

import com.petsitting.dto.RequestDto;
import com.petsitting.model.Request;
import com.petsitting.model.RequestStatus;
import com.petsitting.model.User;
import com.petsitting.repository.RequestRepository;
import com.petsitting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    @Transactional
    public RequestDto createRequest(RequestDto requestDto, Long ownerId) {
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("Owner not found"));

        Request request = new Request();
        request.setOwner(owner);
        request.setStartDate(requestDto.getStartDate());
        request.setEndDate(requestDto.getEndDate());
        request.setPetType(requestDto.getPetType());
        request.setDescription(requestDto.getDescription());
        request.setLatitude(requestDto.getLatitude());
        request.setLongitude(requestDto.getLongitude());
        request.setLocation(requestDto.getLocation());
        request.setStatus(RequestStatus.OPEN);

        request = requestRepository.save(request);
        return convertToDto(request);
    }

    public Page<RequestDto> getRequests(
        RequestStatus status,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Pageable pageable
    ) {
        Page<Request> requests;
        if (startDate != null && endDate != null) {
            requests = requestRepository.findByStatusAndDateRange(status, startDate, endDate, pageable);
        } else {
            requests = requestRepository.findByStatus(status, pageable);
        }
        return requests.map(this::convertToDto);
    }

    public List<RequestDto> getNearbyRequests(
        Double latitude,
        Double longitude,
        Double distanceInMeters
    ) {
        List<Request> requests = requestRepository.findNearbyRequests(
            RequestStatus.OPEN.name(),
            latitude,
            longitude,
            distanceInMeters
        );
        return requests.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public RequestDto acceptRequest(Long requestId, Long sitterId) {
        Request request = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        User sitter = userRepository.findById(sitterId)
            .orElseThrow(() -> new RuntimeException("Sitter not found"));

        request.setSitter(sitter);
        request.setStatus(RequestStatus.ACCEPTED);
        request = requestRepository.save(request);

        return convertToDto(request);
    }

    private RequestDto convertToDto(Request request) {
        RequestDto dto = new RequestDto();
        dto.setId(request.getId());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setPetType(request.getPetType());
        dto.setDescription(request.getDescription());
        dto.setLatitude(request.getLatitude());
        dto.setLongitude(request.getLongitude());
        dto.setLocation(request.getLocation());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());

        if (request.getOwner() != null) {
            dto.setOwnerId(request.getOwner().getId());
            dto.setOwnerName(request.getOwner().getName());
        }

        if (request.getSitter() != null) {
            dto.setSitterId(request.getSitter().getId());
            dto.setSitterName(request.getSitter().getName());
        }

        return dto;
    }
} 