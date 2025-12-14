import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import {
  useRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
} from "../../../hooks/useRoomTypes";
import { roomTypeSchema } from "../../../validations/roomTypeSchema";

export default function RoomTypesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);

  const { data: roomTypesResponse, isLoading, refetch } = useRoomTypes();
  // const roomTypes = roomTypesResponse?.data || [];
  const { mutate: createRoomType, isPending: isCreating } = useCreateRoomType();
  const { mutate: updateRoomType, isPending: isUpdating } = useUpdateRoomType();
  const { mutate: deleteRoomType } = useDeleteRoomType();

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      name: values.name,
      bedsCount: Number(values.bedsCount),
      pricePerBed: Number(values.pricePerBed),
    };

    if (editingRoomType) {
      updateRoomType(
        { id: editingRoomType.id, data: payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            setEditingRoomType(null);
            resetForm();
          },
          onError: () => console.log("Update failed"),
        }
      );
    } else {
      createRoomType(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
        },
        onError: () => console.log("Create failed"),
      });
    }
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setModalVisible(true);
  };

  const handleDelete = (roomType) => {
    Alert.alert(
      "Delete Room Type",
      `Are you sure you want to delete ${roomType.name} room type?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteRoomType(roomType.id, {
              onError: () => console.log("Delete failed"),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingRoomType(null);
    setModalVisible(true);
  };

  const getIconForBedCount = (bedsCount) => {
    if (bedsCount === 1) return { icon: 'person', color: '#007AFF' };
    if (bedsCount === 2) return { icon: 'people', color: '#34C759' };
    if (bedsCount === 3) return { icon: 'people-circle', color: '#FF9500' };
    return { icon: 'bed', color: '#5856D6' };
  };

  console.log(roomTypesResponse,"roomTypesResponseroomTypesResponse");
  
  const renderRoomTypeCard = ({ item }) => {
    const config = getIconForBedCount(item.bedsCount);

    return (
      <View style={styles.roomTypeCard}>
        <View style={styles.roomTypeInfo}>
          <View
            style={[
              styles.roomTypeIconContainer,
              { backgroundColor: config.color + "20" },
            ]}
          >
            <Ionicons name={config.icon} size={28} color={config.color} />
          </View>
          <View style={styles.roomTypeDetails}>
            <Text style={styles.roomTypeName}>{item.name}</Text>
            <Text style={styles.roomTypeMeta}>
              {item.bedsCount} {item.bedsCount === 1 ? "Bed" : "Beds"} • ₹
              {item.pricePerBed}/bed
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Room Types</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {roomTypesResponse?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No room types yet</Text>
          <Text style={styles.emptySubtext}>
            Tap + to add your first room type
          </Text>
        </View>
      ) : (
        <FlatList
          data={roomTypesResponse}
          renderItem={renderRoomTypeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingRoomType(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRoomType ? "Edit Room Type" : "Add New Room Type"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoomType(null);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                name: editingRoomType?.name || "",
                bedsCount: editingRoomType?.bedsCount?.toString() || "",
                pricePerBed: editingRoomType?.pricePerBed?.toString() || "",
              }}
              validationSchema={roomTypeSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <ScrollView style={styles.form}>
                  <Text style={styles.label}>Room Type Name *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.name && errors.name && styles.inputError,
                    ]}
                    placeholder="Enter room type name (e.g., Single, Deluxe, Suite)"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Number of Beds *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.bedsCount &&
                        errors.bedsCount &&
                        styles.inputError,
                    ]}
                    placeholder="Enter number of beds"
                    value={values.bedsCount}
                    onChangeText={handleChange("bedsCount")}
                    onBlur={handleBlur("bedsCount")}
                    keyboardType="number-pad"
                  />
                  {touched.bedsCount && errors.bedsCount && (
                    <Text style={styles.errorText}>{errors.bedsCount}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Price Per Bed *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.pricePerBed &&
                        errors.pricePerBed &&
                        styles.inputError,
                    ]}
                    placeholder="Enter price per bed"
                    value={values.pricePerBed}
                    onChangeText={handleChange("pricePerBed")}
                    onBlur={handleBlur("pricePerBed")}
                    keyboardType="number-pad"
                  />
                  {touched.pricePerBed && errors.pricePerBed && (
                    <Text style={styles.errorText}>{errors.pricePerBed}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!isValid || isCreating || isUpdating) &&
                        styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {editingRoomType
                          ? "Update Room Type"
                          : "Create Room Type"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  addButton: {
    backgroundColor: "#007AFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: { padding: 20, paddingTop: 0 },
  roomTypeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomTypeInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  roomTypeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomTypeDetails: { flex: 1 },
  roomTypeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  roomTypeMeta: { fontSize: 14, color: "#666", marginBottom: 2 },
  roomCount: { fontSize: 12, color: "#999" },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: { fontSize: 20, fontWeight: "600", color: "#999", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#BBB", marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 12 },
  roomTypeSelector: { gap: 12 },
  roomTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#F9F9F9",
    gap: 12,
  },
  roomTypeOptionSelected: {
    backgroundColor: "#F0F8FF",
    borderWidth: 2,
  },
  roomTypeOptionText: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  inputError: { borderColor: "#FF3B30" },
  errorText: { color: "#FF3B30", fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { backgroundColor: "#A0A0A0", opacity: 0.6 },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
