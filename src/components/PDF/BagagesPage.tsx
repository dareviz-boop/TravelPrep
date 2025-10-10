import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FormData } from '@/types/form';
import { filterItemsByConditions } from '@/utils/filterItems';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2563eb',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 25
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 8
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 600,
    fontSize: 9,
    borderBottom: '2px solid #2563eb'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb'
  },
  colItem: {
    width: '50%'
  },
  colQuantity: {
    width: '20%',
    textAlign: 'center'
  },
  colPriority: {
    width: '15%',
    textAlign: 'center'
  },
  colCheckbox: {
    width: '15%',
    textAlign: 'center'
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '2px solid #111827',
    margin: 'auto'
  },
  legend: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 15,
    fontStyle: 'italic'
  }
});

interface BagagesPageProps {
  formData: FormData;
  checklistData: any;
}

export const BagagesPage = ({ formData, checklistData }: BagagesPageProps) => {
  const duree = formData.duree || 'moyen';

  const renderBagageSection = (items: any[], sectionTitle: string) => {
    const filteredItems = items.filter(item =>
      filterItemsByConditions(item, formData)
    );

    if (filteredItems.length === 0) return null;

    return (
      <View style={styles.section} key={sectionTitle}>
        <Text style={styles.sectionTitle}>🎒 {sectionTitle}</Text>
        
        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Article</Text>
          <Text style={styles.colQuantity}>Quantité</Text>
          <Text style={styles.colPriority}>Priorité</Text>
          <Text style={styles.colCheckbox}>À prendre</Text>
        </View>
        
        {filteredItems.map(item => {
          const quantity = item.quantite?.[duree] || 1;
          const pertinence = item.pertinence || {};
          
          // Determine priority symbol
          let prioritySymbol = '○';
          if (pertinence.randonnee === '●' || pertinence.plage === '●' || pertinence.ville === '●') {
            prioritySymbol = '●';
          }
          
          return (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.colItem}>{item.nom}</Text>
              <Text style={styles.colQuantity}>{quantity}</Text>
              <Text style={styles.colPriority}>{prioritySymbol}</Text>
              <View style={styles.colCheckbox}>
                <View style={styles.checkbox} />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>🧳 Bagages Détaillés</Text>
      <Text style={styles.subtitle}>
        Pour votre voyage : {formData.duree ? `${formData.duree}` : 'Durée non spécifiée'} / {checklistData.localisations?.[formData.localisation]?.nom || formData.localisation}
      </Text>
      
      {checklistData.bagages?.vetements && renderBagageSection(
        checklistData.bagages.vetements,
        'Vêtements'
      )}
      
      {checklistData.bagages?.equipement && renderBagageSection(
        checklistData.bagages.equipement,
        'Équipement'
      )}
      
      <Text style={styles.legend}>
        ● = Indispensable  |  ○ = Recommandé  |  - = Non nécessaire
      </Text>
    </Page>
  );
};
