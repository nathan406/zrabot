# Next.js Migration Plan for ZAX

This plan outlines the migration of the ZAX project from a Django + React (Vite) architecture to a unified Next.js (App Router) application.

## 1. Project Initialization
- Use the existing `package.json` in the root.
- Install dependencies: `npm install`.
- Initialize Prisma: `npx prisma init`.
- Create `.env` from Django's settings (OpenAI Key, Database URL).

## 2. Database Schema (Prisma)
Migrate Django models to `schema.prisma`:
- `ChatMessage`
- `UploadedFile`
- `ActiveChatSession`
- `RealTimeChatMessage`
- `KnowledgeCategory`
- `KnowledgeBase` (Articles)

## 3. Backend Implementation (Next.js API Routes)
- `app/api/chatbot/chat/route.ts`:
  - Port logic from `ChatbotAPIView`.
  - Implement `is_greeting`, `is_zra_related`, `get_greeting_response`.
  - OpenAI integration with GPT-3.5 Turbo.
- `app/api/chatbot/upload/route.ts`:
  - Handle multi-part file uploads.
  - Port text extraction logic (PDF, DOCX).
  - Use `tesseract.js` and OpenAI Vision for images.
- `app/api/chatbot/admin/[action]/route.ts`:
  - Port live chat management logic (connect, send_message, end_session, etc.).
  - Maintain polling-compatible structure.

## 4. Frontend Migration
- `app/page.tsx`:
  - Port `frontend/zax/src/App.jsx` and `frontend/zax/src/components/Chatbot.jsx`.
  - Convert to Next.js Client Components.
  - Update API endpoints to relative paths.
- `app/admin/page.tsx`:
  - Port `frontend/zax/src/admin/Admin.jsx`.
  - Implement login logic (matching current mock credentials).
- `app/layout.tsx`:
  - Standard Next.js layout with Tailwind CSS.

## 5. Verification Plan
- **Backend Tests:**
  - Verify `/api/chatbot/chat` handles greetings and ZRA-specific queries.
  - Verify file upload and text extraction works for PDF/Images.
- **Frontend Tests:**
  - Test chat interface for end-to-end messaging.
  - Test admin panel: login, view active sessions, connect, and message.
- **Database:**
  - Ensure all data is correctly persisted in Prisma.

## 6. Cleanup
- Remove `backend/` directory (after verification).
- Remove `frontend/` directory (after verification).
