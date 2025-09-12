import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { parseFindings } from './ImageAnnotation';

// Define the color palette and their meanings for the legend
const LEGEND_PALETTE = [
  { name: 'Urgent Issue', value: '#d9534f' }, // Red
  { name: 'Area of Caution', value: '#f0ad4e' }, // Yellow
  { name: 'General Note', value: '#5bc0de' },    // Blue
];

const styles = StyleSheet.create({
  page: { paddingTop: 35, paddingBottom: 65, paddingHorizontal: 35, fontFamily: 'Helvetica', fontSize: 11, color: '#333' },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  patientInfoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  patientInfoText: { fontSize: 12 },
  divider: { borderBottomColor: '#cccccc', borderBottomWidth: 1, marginVertical: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10, color: '#1a1a1a' },
  imagesContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  imageWrapper: { flex: 1, borderWidth: 1, borderColor: '#eee', padding: 5 },
  imageStyle: { width: '100%', height: 'auto' },
  imageLabel: { textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Oblique', marginTop: 5 },
  footer: { position: 'absolute', bottom: 30, left: 35, right: 35, textAlign: 'center', fontSize: 8, fontFamily: 'Helvetica-Oblique', color: 'grey' },
  recTable: { display: 'flex', flexDirection: 'column', width: '100%' },
  recTableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 },
  recColorBox: { width: 10, height: 10, marginRight: 8 },
  recCondition: { width: '35%', fontFamily: 'Helvetica-Bold' },
  recTreatment: { width: '65%', paddingLeft: 5 },

  // --- NEW STYLES for the Legend ---
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    borderRadius: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorBox: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 9,
  },
});

export const DentalReportPDF = ({ submission, originalImageUrl, annotatedImageDataUrl, adminNotes }) => {
  const { general: generalFindings, recommendations } = parseFindings(adminNotes);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header and Patient Info */}
        <Text style={styles.header}>Oral Health Screening Report</Text>
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientInfoText}>Name: {submission.patient.name}</Text>
          <Text style={styles.patientInfoText}>Date: {new Date().toLocaleDateString('en-GB')}</Text>
        </View>
        <View style={styles.patientInfoContainer}>
          <Text style={styles.patientInfoText}>Phone: {submission.patient.phone || 'N/A'}</Text>
          <Text style={styles.patientInfoText}>Patient ID: {submission.patient.patientId || submission.patient._id}</Text>
        </View>
        <View style={styles.divider} />

        {/* --- NEW ANNOTATION LEGEND SECTION --- */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Annotation Legend:</Text>
            <View style={styles.legendContainer}>
                {LEGEND_PALETTE.map(color => (
                    <View key={color.name} style={styles.legendItem}>
                        <View style={[styles.legendColorBox, { backgroundColor: color.value }]} />
                        <Text style={styles.legendText}>{color.name}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screening Images:</Text>
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}><Image style={styles.imageStyle} src={originalImageUrl} /><Text style={styles.imageLabel}>Original</Text></View>
            <View style={styles.imageWrapper}><Image style={styles.imageStyle} src={annotatedImageDataUrl} /><Text style={styles.imageLabel}>Annotated</Text></View>
          </View>
        </View>

        {/* General Findings Section */}
        {generalFindings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Clinical Findings:</Text>
            {generalFindings.map((finding, index) => (
              <Text key={index}>• {finding}</Text>
            ))}
          </View>
        )}

        {/* Treatment Recommendations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment Recommendations:</Text>
          <View style={styles.recTable}>
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <View key={index} style={styles.recTableRow}>
                  <View style={[styles.recColorBox, { backgroundColor: rec.color }]} />
                  <Text style={styles.recCondition}>{rec.condition}:</Text>
                  <Text style={styles.recTreatment}>{rec.treatment}</Text>
                </View>
              ))
            ) : (
              <Text>No specific treatment recommendations based on notes. General oral hygiene is advised.</Text>
            )}
          </View>
        </View>
        
        <Text style={styles.footer}>
          This report is generated based on digital analysis and should be confirmed by a qualified dental professional.
        </Text>
      </Page>
    </Document>
  );
};