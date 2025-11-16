import { Image, View, StyleSheet } from '@react-pdf/renderer';
import { PDF_ICONS } from '@/utils/pdfIcons';

const styles = StyleSheet.create({
  iconContainer: {
    width: 12,
    height: 12,
    marginRight: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 12,
    height: 12,
  },
});

interface PDFIconProps {
  name: keyof typeof PDF_ICONS;
  style?: any;
}

/**
 * Composant d'icône pour les PDF
 * Affiche une icône SVG optimisée encodée en data URI
 *
 * @example
 * <PDFIcon name="calendar" />
 * <PDFIcon name="globe" style={{ marginRight: 8 }} />
 */
export const PDFIcon = ({ name, style }: PDFIconProps) => {
  const iconSrc = PDF_ICONS[name];

  return (
    <View style={[styles.iconContainer, style]}>
      <Image src={iconSrc} style={styles.icon} />
    </View>
  );
};
