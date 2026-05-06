import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
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

const UploaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.xl};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const UploaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const UploadLabel = styled.label`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

const Hint = styled.span`
  font-family: ${fonts.mono};
  font-size: 10px;
  color: ${colors.textTertiary};
`;

const DropZone = styled.div<{ $dragOver: boolean }>`
  border: 1.5px dashed ${(p) => (p.$dragOver ? colors.accentWarm : colors.border)};
  border-radius: ${radius.lg};
  padding: ${spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(p) => (p.$dragOver ? 'rgba(200,168,130,0.06)' : colors.surfaceAlt)};

  &:hover {
    border-color: rgba(200, 168, 130, 0.5);
  }
`;

const DropText = styled.p`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.textTertiary};
  margin-bottom: ${spacing.sm};
`;

const ChooseBtn = styled.span`
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${colors.accentWarm};
  text-decoration: underline;
  cursor: pointer;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${radius.md};
  overflow: hidden;
  background: ${colors.surfaceAlt};
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  color: ${colors.textPrimary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;

  &:hover {
    background: ${colors.error};
  }
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 2px;
  background: ${colors.border};
  border-radius: 1px;
  margin-top: ${spacing.sm};
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(p) => p.$progress}%;
    background: ${colors.accentWarm};
    transition: width 0.3s ease;
  }
`;

interface UploadedImage {
  url: string;
  localPreview?: string;
}

interface SingleUploaderProps {
  label: string;
  hint?: string;
  value: string;
  accept?: string;
  onChange: (url: string) => void;
}

const SingleUploader: React.FC<SingleUploaderProps> = ({ label, hint, value, accept = 'image/*', onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setUploading(true);
      const localUrl = URL.createObjectURL(file);
      // In real app: upload to Firebase Storage here
      // Simulate upload delay
      await new Promise((r) => setTimeout(r, 800));
      onChange(localUrl);
      setUploading(false);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <UploaderBlock>
      <UploadLabel>
        {label} {hint && <Hint>({hint})</Hint>}
      </UploadLabel>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {value ? (
        <PreviewItem style={{ aspectRatio: '16/9', height: 120, width: '100%' }}>
          <PreviewImg src={value} alt="preview" />
          <RemoveBtn onClick={() => onChange('')}>×</RemoveBtn>
        </PreviewItem>
      ) : (
        <DropZone
          $dragOver={dragOver}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <DropText>드래그하거나 <ChooseBtn>파일 선택</ChooseBtn></DropText>
        </DropZone>
      )}
      {uploading && <ProgressBar $progress={70} />}
    </UploaderBlock>
  );
};

interface MultiUploaderProps {
  label: string;
  hint?: string;
  values: string[];
  maxFiles?: number;
  onChange: (urls: string[]) => void;
}

const MultiUploader: React.FC<MultiUploaderProps> = ({ label, hint, values, maxFiles = 10, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxFiles - values.length;
      const toAdd = files.slice(0, remaining);
      const localUrls = toAdd.map((f) => URL.createObjectURL(f));
      onChange([...values, ...localUrls]);
    },
    [values, maxFiles, onChange]
  );

  const removeAt = (idx: number) => {
    const next = [...values];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <UploaderBlock style={{ gridColumn: '1 / -1' }}>
      <UploadLabel>
        {label} {hint && <Hint>({hint})</Hint>} <Hint>— {values.length}/{maxFiles}</Hint>
      </UploadLabel>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          handleFiles(files);
        }}
      />
      <DropZone
        $dragOver={dragOver}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
      >
        <DropText>이미지 드래그하거나 <ChooseBtn>파일 선택</ChooseBtn> (최대 {maxFiles}장)</DropText>
      </DropZone>
      {values.length > 0 && (
        <PreviewGrid>
          {values.map((url, i) => (
            <PreviewItem key={i}>
              <PreviewImg src={url} alt={`gallery-${i}`} />
              <RemoveBtn onClick={() => removeAt(i)}>×</RemoveBtn>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </UploaderBlock>
  );
};

interface ImageUploaderProps {
  thumbnailUrl: string;
  heroUrl: string;
  galleryImages: string[];
  processImages: string[];
  onThumbnailChange: (url: string) => void;
  onHeroChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
  onProcessChange: (urls: string[]) => void;
  onSave: () => Promise<void>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  thumbnailUrl, heroUrl, galleryImages, processImages,
  onThumbnailChange, onHeroChange, onGalleryChange, onProcessChange, onSave,
}) => {
  const [saving, setSaving] = useState(false);

  return (
    <Section>
      <SectionTitle>미디어 업로드</SectionTitle>
      <UploaderGrid>
        <SingleUploader
          label="썸네일 이미지"
          hint="4:3 권장, 800px 이상"
          value={thumbnailUrl}
          onChange={onThumbnailChange}
        />
        <SingleUploader
          label="히어로 이미지"
          hint="16:9 권장, 1920px 이상"
          value={heroUrl}
          onChange={onHeroChange}
        />
        <MultiUploader
          label="갤러리 이미지"
          hint="최대 10장"
          values={galleryImages}
          maxFiles={10}
          onChange={onGalleryChange}
        />
        <MultiUploader
          label="제작 과정 이미지"
          hint="최대 5장, 선택"
          values={processImages}
          maxFiles={5}
          onChange={onProcessChange}
        />
      </UploaderGrid>
      <button
        onClick={async () => { setSaving(true); await onSave(); setSaving(false); }}
        disabled={saving}
        style={{
          marginTop: spacing.lg,
          padding: `${spacing.md} ${spacing.xl}`,
          background: colors.accentWarm,
          color: colors.black,
          border: 'none',
          borderRadius: radius.md,
          fontFamily: fonts.mono,
          fontSize: '12px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.4 : 1,
        }}
      >
        {saving ? '저장 중…' : '저장하기'}
      </button>
    </Section>
  );
};

export default ImageUploader;
