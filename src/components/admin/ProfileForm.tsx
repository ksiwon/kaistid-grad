import React, { useState } from 'react';
import styled from 'styled-components';
import { ArtistData } from '../../types/artist';
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

  &::placeholder {
    color: ${colors.textTertiary};
  }
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

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

interface ProfileFormProps {
  artist: ArtistData;
  onSave: (data: Partial<ArtistData>) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ artist, onSave }) => {
  const [nameKo, setNameKo] = useState(artist.name.ko);
  const [nameEn, setNameEn] = useState(artist.name.en);
  const [email, setEmail] = useState(artist.contact.email || '');
  const [instagram, setInstagram] = useState(artist.contact.instagram || '');
  const [behance, setBehance] = useState(artist.contact.behance || '');
  const [website, setWebsite] = useState(artist.contact.website || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name: { ko: nameKo, en: nameEn },
        contact: { email, instagram, behance, website },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section>
      <SectionTitle>프로필 정보</SectionTitle>
      <Grid>
        <Field>
          <Label>이름 (한국어)</Label>
          <Input value={nameKo} onChange={(e) => setNameKo(e.target.value)} placeholder="홍길동" />
        </Field>
        <Field>
          <Label>Name (English)</Label>
          <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Hong Gildong" />
        </Field>
        <Field>
          <Label>이메일</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@kaist.ac.kr" />
        </Field>
        <Field>
          <Label>인스타그램</Label>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" />
        </Field>
        <Field>
          <Label>비핸스</Label>
          <Input value={behance} onChange={(e) => setBehance(e.target.value)} placeholder="username" />
        </Field>
        <Field>
          <Label>웹사이트</Label>
          <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
        </Field>
      </Grid>
      <SaveBtn onClick={handleSave} disabled={saving}>
        {saving ? '저장 중…' : '저장하기'}
      </SaveBtn>
    </Section>
  );
};

export default ProfileForm;
