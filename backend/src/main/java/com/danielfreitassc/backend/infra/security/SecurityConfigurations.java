package com.danielfreitassc.backend.infra.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfigurations {
    private final SecurityFilter securityFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(authorize -> authorize

                .requestMatchers(HttpMethod.POST,"/users").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/users").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/users/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.PATCH,"/users/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.DELETE,"/users/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")

                .requestMatchers(HttpMethod.POST,"/services").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/services/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.PUT,"/services/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.DELETE,"/services/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/services").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                
                .requestMatchers(HttpMethod.GET,"/services/public/{id}").permitAll()
                
                .requestMatchers(HttpMethod.POST,"/media").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/media").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.GET,"/media/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.PUT,"/media/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")
                .requestMatchers(HttpMethod.DELETE,"/media/{id}").hasAnyRole("ADMIN","EMPLOYEE_SECRETARY","EMPLOYEE_MECHANIC")

                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET,"/validation").permitAll()
                
                .requestMatchers("/error").anonymous()
                .anyRequest().denyAll()

                ).addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOrigin("http://localhost:19000");
        configuration.addAllowedOrigin("http://localhost:19002");
        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedMethod(HttpMethod.POST);
        configuration.addAllowedMethod(HttpMethod.GET);
        configuration.addAllowedMethod(HttpMethod.PUT);
        configuration.addAllowedMethod(HttpMethod.PATCH);
        configuration.addAllowedMethod(HttpMethod.DELETE);
        configuration.addAllowedHeader("*"); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
