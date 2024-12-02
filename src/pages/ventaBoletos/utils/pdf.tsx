import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { type Ticket } from "../schema/boletos.interface";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  companyInfo: {
    textAlign: "center",
    marginBottom: 30,
  },
});

const companyDetails = {
  name: "Transporte Andino S.A.",
  address: "Av. Los Libertadores 1234, Andahuaylas",
  contact: "Tel: 01-234-5678 | Email: contacto@transandino.com",
  ruc: "20123456789",
};

type Props = { datosViaje: Ticket };

const PdfTicket = ({ datosViaje }: Props) => {
  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Información de la empresa */}
        <View style={styles.companyInfo}>
          <Text style={[styles.bold, { fontSize: 16 }]}>
            {companyDetails.name}
          </Text>
          <Text>{companyDetails.address}</Text>
          <Text>{companyDetails.contact}</Text>
          <Text>RUC: {companyDetails.ruc}</Text>
        </View>

        {/* Título del boleto */}
        <Text style={styles.header}>Boleto de Venta</Text>

        {/* Información del cliente */}
        <View style={styles.section}>
          <Text style={styles.bold}>Datos del Cliente</Text>
          <View style={styles.row}>
            <Text>Nombres:</Text>
            <Text>{datosViaje.nombres}</Text>
          </View>
          <View style={styles.row}>
            <Text>Apellidos:</Text>
            <Text>{datosViaje.apellidos}</Text>
          </View>
          <View style={styles.row}>
            <Text>Documento:</Text>
            <Text>
              {datosViaje.tipo_documento} - {datosViaje.num_documento}
            </Text>
          </View>
        </View>

        {/* Información del viaje */}
        <View style={styles.section}>
          <Text style={styles.bold}>Detalles del Viaje</Text>
          <View style={styles.row}>
            <Text>Origen:</Text>
            <Text>{datosViaje.origen}</Text>
          </View>
          <View style={styles.row}>
            <Text>Destino:</Text>
            <Text>{datosViaje.destino}</Text>
          </View>
          <View style={styles.row}>
            <Text>N° Asiento:</Text>
            <Text>{datosViaje.num_asiento}</Text>
          </View>
          <View style={styles.row}>
            <Text>Fecha de Salida:</Text>
            <Text>{datosViaje.fechaSalida}</Text>
          </View>
          <View style={styles.row}>
            <Text>Hora de Salida:</Text>
            <Text>{datosViaje.horaSalida}</Text>
          </View>
        </View>

        {/* Pie de página */}
        <View>
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Gracias por confiar en {companyDetails.name}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfTicket;
