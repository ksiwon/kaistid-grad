import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Comment, StickyColor, STICKY_COLORS, STICKY_COLOR_LIST } from '../../types/comment';
import { subscribeComments, addComment } from '../../services/commentService';
import { colors, fonts } from '../../styles/tokens';

// ── Helpers ───────────────────────────────────────────────────
function getRot(id: string): number {
  // Deterministic rotation from id so notes don't jump on re-render
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 11) - 5) * 0.85;
}

// ── Animations ────────────────────────────────────────────────
const gridLine = 'rgba(232,228,220,0.04)';

// ── Styled ────────────────────────────────────────────────────
const Wrapper = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const BoardTitle = styled.h3`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.15em;
  color: ${colors.textTertiary};
  text-transform: uppercase;
`;

const CountTag = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

const Board = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  background:
    repeating-linear-gradient(0deg,   transparent,    transparent    39px, ${gridLine} 39px, ${gridLine} 40px),
    repeating-linear-gradient(90deg,  transparent,    transparent    39px, ${gridLine} 39px, ${gridLine} 40px);
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  padding: 12px;
`;

const Empty = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${colors.textTertiary};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  pointer-events: none;
`;

const Note = styled(motion.div)<{ $color: StickyColor }>`
  position: absolute;
  width: 144px;
  min-height: 112px;
  padding: 12px 11px 10px;
  background: ${({ $color }) => STICKY_COLORS[$color].bg};
  border: 1px solid ${({ $color }) => STICKY_COLORS[$color].border};
  border-radius: 2px;
  box-shadow: 2px 3px 10px rgba(0,0,0,0.22);
  cursor: default;
  z-index: 1;

  /* prevent notes from going out-of-bounds */
  max-width: calc(100% - 16px);
`;

const NoteText = styled.p<{ $color: StickyColor }>`
  font-family: ${fonts.body};
  font-size: 12px;
  line-height: 1.55;
  color: ${({ $color }) => STICKY_COLORS[$color].text};
  word-break: keep-all;
  overflow-wrap: break-word;
  margin-bottom: 8px;
`;

const NoteNick = styled.span<{ $color: StickyColor }>`
  display: block;
  font-family: ${fonts.mono};
  font-size: 10px;
  opacity: 0.55;
  color: ${({ $color }) => STICKY_COLORS[$color].text};
`;

// ── Form ──────────────────────────────────────────────────────
const FormBox = styled.div`
  margin-top: 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 14px 16px;
  background: ${colors.surfaceAlt};
`;

const ColorRow = styled.div`
  display: flex;
  gap: 7px;
  margin-bottom: 10px;
`;

const Dot = styled.button<{ $c: StickyColor; $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $c }) => STICKY_COLORS[$c].bg};
  border: 2px solid ${({ $c, $active }) => ($active ? STICKY_COLORS[$c].border : 'transparent')};
  cursor: pointer;
  transition: transform 0.14s;
  flex-shrink: 0;

  &:hover { transform: scale(1.25); }
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const Textarea = styled.textarea`
  flex: 1;
  min-height: 76px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 4px;
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 13px;
  line-height: 1.6;
  padding: 9px 11px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: ${colors.textTertiary}; }
  &:focus { border-color: ${colors.borderHover}; }
`;

const PostBtn = styled.button`
  align-self: flex-end;
  padding: 10px 18px;
  background: ${colors.accentWarm};
  color: ${colors.black};
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  border-radius: 4px;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: ${colors.accentWarmHover}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const CharCount = styled.div`
  text-align: right;
  margin-top: 5px;
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

// ── Component ─────────────────────────────────────────────────
const MAX_LEN = 200;

interface StickyBoardProps {
  artistId: string;
}

export const StickyBoard: React.FC<StickyBoardProps> = ({ artistId }) => {
  const [comments, setComments]   = useState<Comment[]>([]);
  const [text, setText]           = useState('');
  const [color, setColor]         = useState<StickyColor>('yellow');
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time comments (mock or Firebase)
  useEffect(() => {
    const unsub = subscribeComments(artistId, setComments);
    return unsub;
  }, [artistId]);

  const handlePost = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await addComment(artistId, trimmed, color);
      setText('');
    } catch (err) {
      console.error('[StickyBoard] Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  }, [artistId, color, submitting, text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost();
  };

  return (
    <Wrapper>
      <Header>
        <BoardTitle>관람객 노트</BoardTitle>
        <CountTag>{comments.length}개의 생각</CountTag>
      </Header>

      <Board>
        <AnimatePresence>
          {comments.length === 0 && (
            <Empty>
              <span>✦</span>
              <span>아래에 첫 번째 생각을 남겨보세요</span>
            </Empty>
          )}

          {comments.map((c) => {
            const rot = getRot(c.id);
            // Clamp position so notes don't overflow the 300px board
            const left = `${Math.min(Math.max(c.posX, 2), 58)}%`;
            const top  = `${Math.min(Math.max(c.posY, 2), 52)}%`;

            return (
              <Note
                key={c.id}
                $color={c.color}
                style={{ left, top }}
                initial={{ scale: 0.4, opacity: 0, rotate: rot - 12 }}
                animate={{ scale: 1,   opacity: 1, rotate: rot }}
                exit={   { scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                whileHover={{ scale: 1.09, rotate: 0, zIndex: 20 }}
              >
                <NoteText $color={c.color}>{c.text}</NoteText>
                <NoteNick $color={c.color}>— {c.nickname}</NoteNick>
              </Note>
            );
          })}
        </AnimatePresence>
      </Board>

      <FormBox>
        <ColorRow>
          {STICKY_COLOR_LIST.map((c) => (
            <Dot
              key={c}
              $c={c}
              $active={color === c}
              onClick={() => setColor(c)}
              title={c}
              type="button"
            />
          ))}
        </ColorRow>

        <InputRow>
          <Textarea
            placeholder="이 작품에 대한 생각이나 느낀 점을 남겨보세요… (Ctrl+Enter로 제출)"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
            onKeyDown={handleKeyDown}
            maxLength={MAX_LEN}
          />
          <PostBtn
            type="button"
            onClick={handlePost}
            disabled={!text.trim() || submitting}
          >
            {submitting ? '…' : '붙이기'}
          </PostBtn>
        </InputRow>

        <CharCount>{text.length} / {MAX_LEN}</CharCount>
      </FormBox>
    </Wrapper>
  );
};