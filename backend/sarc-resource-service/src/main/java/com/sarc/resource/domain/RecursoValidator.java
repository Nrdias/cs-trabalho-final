package com.sarc.resource.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RecursoValidator {

    private final RestTemplate restTemplate;

    @Autowired
    public RecursoValidator(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean hasActiveReservations(Long idRecurso) {
        try {
            // Queries the reservation microservice dynamically via Eureka discovery service
            String url = "http://sarc-reservation-service/api/v1/reservas/check-active?idRecurso=" + idRecurso;
            Boolean hasActive = restTemplate.getForObject(url, Boolean.class);
            return hasActive != null && hasActive;
        } catch (Exception e) {
            // Fallback: if reservation service is unreachable or not yet initialized, assume no active bookings
            return false;
        }
    }
}
