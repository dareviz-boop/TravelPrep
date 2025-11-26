/**
 * Fonctions d'export de la checklist vers différents formats
 */

import { GeneratedChecklist } from './types';

/**
 * Génère un résumé textuel de la checklist
 */
export function getChecklistSummary(checklist: GeneratedChecklist): string {
  const { metadata, stats } = checklist;

  return `
Checklist de voyage : ${metadata.nomVoyage}
Destination : ${metadata.pays.join(', ')}
Dates : ${metadata.dateDepart} ${metadata.dateRetour ? `- ${metadata.dateRetour}` : ''}
Durée : ${metadata.duree}
Profil : ${metadata.profil} | Type : ${metadata.typeVoyage} | Confort : ${metadata.confort}

📊 Statistiques :
- ${stats.totalItems} items au total
- ${stats.totalSections} sections
- ${stats.itemsEssentiels} items essentiels
- ${stats.itemsImportants} items importants
- ${stats.itemsOptionnels} items optionnels

✅ Générée le : ${metadata.genereeLe}
  `.trim();
}

/**
 * Exporte la checklist au format JSON
 */
export function exportChecklistJSON(checklist: GeneratedChecklist): string {
  return JSON.stringify(checklist, null, 2);
}

/**
 * Exporte la checklist au format CSV
 */
export function exportChecklistCSV(checklist: GeneratedChecklist): string {
  let csv = 'Section,Item,Priorité,Délai,Moment,Quantité,Conseils\n';

  for (const section of checklist.sections) {
    for (const item of section.items) {
      const row = [
        section.nom,
        item.item,
        item.priorite || '',
        item.delai || '',
        item.moment || '',
        item.quantite || '',
        (item.conseils || '').replace(/"/g, '""')
      ];

      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    }
  }

  return csv;
}
