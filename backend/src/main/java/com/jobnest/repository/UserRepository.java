package com.jobnest.repository;

import com.jobnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(TRIM(u.username)) = LOWER(TRIM(:identifier)) " +
           "OR LOWER(TRIM(u.email)) = LOWER(TRIM(:identifier)) " +
           "OR LOWER(TRIM(u.fullName)) = LOWER(TRIM(:identifier)) " +
           "OR LOWER(TRIM(u.displayName)) = LOWER(TRIM(:identifier))")
    Optional<User> findByIdentifier(@Param("identifier") String identifier);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

