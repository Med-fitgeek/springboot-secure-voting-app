package org.example;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class Lamdas {


    class User {
        String email;

        public String getEmail() {
            return email;
        }

        public boolean isActive() {
            return active;
        }

        boolean active;
    }

   
    Predicate<User> activeUsers = u -> u.isActive();

    Predicate<User> emailExist = u -> u.getEmail() != null;
    Predicate<User> isValidEmail = emailExist.and(u -> u.getEmail().contains("@"));

    List<User> validUsers = users.stream()
            .filter(isValidEmail);
}
