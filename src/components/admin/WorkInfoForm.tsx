import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { ArtistData, ArtworkCategory, CATEGORY_LABELS } from '../../types/artist';
import { colors, fonts, spacing, radius } from '../../styles/tokens';

const Section = styled.section`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${colors.accentWarm};
  margin-bottom: ${spacing.xl};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};

  &.full {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const Input = styled.input`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.accentWarm};
  }
`;

const Textarea = styled.textarea`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 14px;
  line-height: 1.7;
  resize: vertical;
  min-height: 160px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.accentWarm};
  }
`;

const Select = styled.select`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  font-size: 14px;
  outline: none;
  cursor: pointer;

  option {
    background: ${colors.surface};
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
`;

const Tab = styled.button<{ $active: boolean }>`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: ${radius.md};
  border: 1px solid ${(p) => (p.$active ? colors.accentWarm : colors.border)};
  background: ${(p) => (p.$active ? colors.accentWarm : 'transparent')};
  color: ${(p) => (p.$active ? colors.black : colors.textSecondary)};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Preview = styled.div`
  background: ${colors.surfaceAlt};
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  padding: ${spacing.md};
  min-height: 160px;
  font-family: ${fonts.body};
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.textPrimary};

  p { margin-bottom: ${spacing.md}; }
`;

const Hint = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
  letter-spacing: 0.08em;
`;

const SaveBtn = styled.button`
  margin-top: ${spacing.lg};
  padding: ${spacing.md} ${spacing.xl};
  background: ${colors.accentWarm};
  color: ${colors.black};
  border: none;
  border-radius: ${radius.md};
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

interface WorkInfoFormProps {
  artist: ArtistData;
  onSave: (data: Partial<ArtistData>) => Promise<void>;
}

const WorkInfoForm: React.FC<WorkInfoFormProps> = ({ artist, onSave }) => {
  const [titleKo, setTitleKo] = useState(artist.work.titleKo);
  const [titleEn, setTitleEn] = useState(artist.work.titleEn);
  const [category, setCategory] = useState<ArtworkCategory>(artist.category);
  const [statementKo, setStatementKo] = useState(artist.work.statementKo);
  const [statementEn, setStatementEn] = useState(artist.work.statementEn || '');
  const [processNote, setProcessNote] = useState(artist.work.processNoteKo || '');
  const [keywords, setKeywords] = useState(artist.work.keywords.join(', '));
  const [videoUrl, setVideoUrl] = useState(artist.media.videoUrl || '');
  const [stmtTab, setStmtTab] = useState<'write' | 'preview'>('write');
  const [processTab, setProcessTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        category,
        work: {
          ...artist.work,
          titleKo,
          titleEn,
          statementKo,
          statementEn,
          processNoteKo: processNote,
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
        media: { ...artist.media, videoUrl },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section>
      <SectionTitle>작품 정보</SectionTitle>
      <Grid>
        <Field>
          <Label>작품명 (한국어)</Label>
          <Input value={titleKo} onChange={(e) => setTitleKo(e.target.value)} />
        </Field>
        <Field>
          <Label>Work Title (English)</Label>
          <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </Field>
        <Field>
          <Label>분야</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value as ArtworkCategory)}>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>키워드 <Hint>(쉼표로 구분)</Hint></Label>
          <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="햅틱, 접근성, 음악" />
        </Field>
        <Field className="full">
          <Label>기획 의도 (한국어) <Hint>Markdown 지원</Hint></Label>
          <TabRow>
            <Tab $active={stmtTab === 'write'} onClick={() => setStmtTab('write')}>편집</Tab>
            <Tab $active={stmtTab === 'preview'} onClick={() => setStmtTab('preview')}>미리보기</Tab>
          </TabRow>
          {stmtTab === 'write' ? (
            <Textarea value={statementKo} onChange={(e) => setStatementKo(e.target.value)} />
          ) : (
            <Preview><ReactMarkdown>{statementKo}</ReactMarkdown></Preview>
          )}
        </Field>
        <Field className="full">
          <Label>Statement (English) <Hint>선택</Hint></Label>
          <Textarea value={statementEn} onChange={(e) => setStatementEn(e.target.value)} />
        </Field>
        <Field className="full">
          <Label>제작 과정 노트 <Hint>Markdown 지원, 선택</Hint></Label>
          <TabRow>
            <Tab $active={processTab === 'write'} onClick={() => setProcessTab('write')}>편집</Tab>
            <Tab $active={processTab === 'preview'} onClick={() => setProcessTab('preview')}>미리보기</Tab>
          </TabRow>
          {processTab === 'write' ? (
            <Textarea value={processNote} onChange={(e) => setProcessNote(e.target.value)} />
          ) : (
            <Preview><ReactMarkdown>{processNote}</ReactMarkdown></Preview>
          )}
        </Field>
        <Field className="full">
          <Label>영상 URL <Hint>YouTube/Vimeo embed URL, 선택</Hint></Label>
          <Input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
        </Field>
      </Grid>
      <SaveBtn onClick={handleSave} disabled={saving}>
        {saving ? '저장 중…' : '저장하기'}
      </SaveBtn>
    </Section>
  );
};

export default WorkInfoForm;
