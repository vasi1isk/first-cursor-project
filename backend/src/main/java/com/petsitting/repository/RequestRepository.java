package com.petsitting.repository;

import com.petsitting.model.Request;
import com.petsitting.model.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    Page<Request> findByStatus(RequestStatus status, Pageable pageable);
    
    @Query("SELECT r FROM Request r WHERE r.status = :status AND r.startDate >= :startDate AND r.endDate <= :endDate")
    Page<Request> findByStatusAndDateRange(
        @Param("status") RequestStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    @Query(value = "SELECT r.* FROM requests r WHERE r.status = :status AND " +
           "ST_DWithin(ST_MakePoint(r.longitude, r.latitude)::geography, " +
           "ST_MakePoint(:longitude, :latitude)::geography, :distanceInMeters)",
           nativeQuery = true)
    List<Request> findNearbyRequests(
        @Param("status") String status,
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("distanceInMeters") Double distanceInMeters
    );
} 