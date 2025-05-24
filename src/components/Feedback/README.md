# Feedback System

This module provides components for collecting and displaying user feedback on AI-generated messages.

## Components

### FeedbackButtons

A component that displays like/dislike buttons and collects feedback.

```tsx
<FeedbackButtons
  messageId="unique-message-id"
  messageContent="The message content"
  messageMetadata={{
    messageType: "promotional",
    mediaType: "text",
    tone: "friendly"
  }}
  onFeedback={(isPositive) => console.log('Feedback received:', isPositive ? 'like' : 'dislike')}
/>
```

### FeedbackStats

Displays statistics about feedback for a specific message.

```tsx
<FeedbackStats messageId="unique-message-id" />
```

## Database Schema

### message_feedback

Stores user feedback on AI-generated messages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID (FK) | Reference to auth.users |
| message_id | UUID | ID of the message being rated |
| is_positive | boolean | Whether the feedback is positive |
| feedback_text | text | Optional feedback text |
| message_content | text | The message content |
| message_metadata | jsonb | Additional metadata about the message |
| formatting_analysis | jsonb | Analysis of message formatting |
| created_at | timestamptz | When the feedback was created |

## API Endpoints

### POST /api/feedback

Submit feedback for a message.

**Request body:**

```json
{
  "message_id": "unique-message-id",
  "is_positive": true,
  "feedback_text": "Optional feedback text",
  "message_content": "The message content",
  "message_metadata": {
    "message_type": "promotional",
    "media_type": "text",
    "tone": "friendly"
  },
  "formatting_analysis": [
    {
      "format_type": "bold",
      "position_start": 0,
      "position_end": 5,
      "content": "Hello",
      "context_category": "greeting"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "feedback-id",
    "message_id": "unique-message-id",
    "is_positive": true,
    "feedback_text": "Optional feedback text",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
}
```
