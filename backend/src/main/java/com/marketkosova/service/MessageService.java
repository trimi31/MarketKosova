package com.marketkosova.service;

import com.marketkosova.dto.ConversationResponse;
import com.marketkosova.dto.MessageResponse;
import com.marketkosova.entity.Conversation;
import com.marketkosova.entity.Listing;
import com.marketkosova.entity.Message;
import com.marketkosova.entity.User;
import com.marketkosova.repository.ConversationRepository;
import com.marketkosova.repository.ListingRepository;
import com.marketkosova.repository.MessageRepository;
import com.marketkosova.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

        private final ConversationRepository conversationRepository;
        private final MessageRepository messageRepository;
        private final UserRepository userRepository;
        private final ListingRepository listingRepository;

        public List<ConversationResponse> getConversations(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return conversationRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                                .stream()
                                .map(conv -> mapToConversationResponse(conv, user))
                                .collect(Collectors.toList());
        }

        @Transactional
        public ConversationResponse getOrCreateConversation(Long listingId, String username) {
                User buyer = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Listing listing = listingRepository.findById(listingId)
                                .orElseThrow(() -> new RuntimeException("Listing not found"));

                User seller = listing.getUser();

                if (buyer.getId().equals(seller.getId())) {
                        throw new RuntimeException("You cannot message yourself");
                }

                Conversation conversation = conversationRepository
                                .findByBuyerIdAndListingId(buyer.getId(), listingId)
                                .orElseGet(() -> {
                                        Conversation newConv = Conversation.builder()
                                                        .buyer(buyer)
                                                        .seller(seller)
                                                        .listing(listing)
                                                        .build();
                                        return conversationRepository.save(newConv);
                                });

                return mapToConversationResponse(conversation, buyer);
        }

        public List<MessageResponse> getMessages(Long conversationId, String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new RuntimeException("Conversation not found"));

                // Only participants can view messages
                if (!conversation.getBuyer().getId().equals(user.getId())
                                && !conversation.getSeller().getId().equals(user.getId())) {
                        throw new RuntimeException("You are not a participant in this conversation");
                }

                return messageRepository.findByConversationIdOrderBySentAtAsc(conversationId)
                                .stream()
                                .map(this::mapToMessageResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public MessageResponse sendMessage(Long conversationId, String content, String username) {
                log.info("sendMessage called: conversationId={}, username={}, contentLength={}", conversationId,
                                username, content != null ? content.length() : 0);

                User sender = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new RuntimeException("Conversation not found"));

                log.info("Conversation found: buyerId={}, sellerId={}, senderId={}",
                                conversation.getBuyer().getId(), conversation.getSeller().getId(), sender.getId());

                // Only participants can send messages
                if (!conversation.getBuyer().getId().equals(sender.getId())
                                && !conversation.getSeller().getId().equals(sender.getId())) {
                        throw new RuntimeException("You are not a participant in this conversation");
                }

                Message message = Message.builder()
                                .conversation(conversation)
                                .sender(sender)
                                .content(content)
                                .build();

                message = messageRepository.save(message);
                conversationRepository.save(conversation);

                return mapToMessageResponse(message);
        }

        public ConversationResponse getConversationById(Long conversationId, String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new RuntimeException("Conversation not found"));

                if (!conversation.getBuyer().getId().equals(user.getId())
                                && !conversation.getSeller().getId().equals(user.getId())) {
                        throw new RuntimeException("You are not a participant in this conversation");
                }

                return mapToConversationResponse(conversation, user);
        }

        private ConversationResponse mapToConversationResponse(Conversation conv, User currentUser) {
                boolean isBuyer = conv.getBuyer().getId().equals(currentUser.getId());
                User otherUser = isBuyer ? conv.getSeller() : conv.getBuyer();

                String lastMessageContent = null;
                LocalDateTime lastMessageAt = null;

                var lastMsg = messageRepository.findLastMessageByConversationId(conv.getId());
                if (lastMsg.isPresent()) {
                        lastMessageContent = lastMsg.get().getContent();
                        lastMessageAt = lastMsg.get().getSentAt();
                }

                return ConversationResponse.builder()
                                .id(conv.getId())
                                .listingId(conv.getListing().getId())
                                .listingTitle(conv.getListing().getTitle())
                                .listingImage(conv.getListing().getImage())
                                .otherUserId(otherUser.getId())
                                .otherUsername(otherUser.getUsername())
                                .lastMessage(lastMessageContent)
                                .lastMessageAt(lastMessageAt)
                                .createdAt(conv.getCreatedAt())
                                .build();
        }

        private MessageResponse mapToMessageResponse(Message message) {
                return MessageResponse.builder()
                                .id(message.getId())
                                .conversationId(message.getConversation().getId())
                                .senderId(message.getSender().getId())
                                .senderUsername(message.getSender().getUsername())
                                .content(message.getContent())
                                .sentAt(message.getSentAt())
                                .build();
        }
}
