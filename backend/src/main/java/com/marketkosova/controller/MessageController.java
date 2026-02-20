package com.marketkosova.controller;

import com.marketkosova.dto.ConversationResponse;
import com.marketkosova.dto.MessageRequest;
import com.marketkosova.dto.MessageResponse;
import com.marketkosova.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(messageService.getConversations(authentication.getName()));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> getOrCreateConversation(
            @RequestParam Long listingId,
            Authentication authentication) {
        return ResponseEntity.ok(messageService.getOrCreateConversation(listingId, authentication.getName()));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationResponse> getConversation(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(messageService.getConversationById(id, authentication.getName()));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(messageService.getMessages(id, authentication.getName()));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long id,
            @Valid @RequestBody MessageRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(messageService.sendMessage(id, request.getContent(), authentication.getName()));
    }
}
