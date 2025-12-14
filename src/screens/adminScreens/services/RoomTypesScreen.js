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
import { useTheme } from "../../../context/ThemeContext";
import {
  useRoomTypes,
  useCreateRoomType,
  useUpdateRoomType,
  useDeleteRoomType,
} from "../../../hooks/useRoomTypes";
import { roomTypeSchema } from "../../../validations/roomTypeSchema";

export default function RoomTypesScreen() {
  const { theme } = useTheme();
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
    if (bedsCount === 1) return { icon: 'person', color: theme.colors.primary };
    if (bedsCount === 2) return { icon: 'people', color: theme.colors.success };
    if (bedsCount === 3) return { icon: 'people-circle', color: theme.colors.warning };
    return { icon: 'bed', color: theme.colors.info };
  };

  const renderRoomTypeCard = ({ item }) => {
    const config = getIconForBedCount(item.bedsCount);

    return (
      <View style={[styles.roomTypeCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
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
            <Text style={[styles.roomTypeName, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={[styles.roomTypeMeta, { color: theme.colors.textSecondary }]}>
              {item.bedsCount} {item.bedsCount === 1 ? "Bed" : "Beds"} • ₹
              {item.pricePerBed}/bed
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        {/* Title handled by nav */}
        {/* <Text style={[styles.title, { color: theme.colors.text }]}>Room Types</Text> */}
        <View />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </View>

      {roomTypesResponse?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No room types yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingRoomType ? "Edit Room Type" : "Add New Room Type"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoomType(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
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
                  <Text style={[styles.label, { color: theme.colors.text }]}>Room Type Name *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.name && errors.name && { borderColor: theme.colors.error },
                    ]}
                    placeholder="Enter room type name (e.g., Single, Deluxe, Suite)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                  {touched.name && errors.name && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                    Number of Beds *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.bedsCount &&
                      errors.bedsCount &&
                      { borderColor: theme.colors.error },
                    ]}
                    placeholder="Enter number of beds"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.bedsCount}
                    onChangeText={handleChange("bedsCount")}
                    onBlur={handleBlur("bedsCount")}
                    keyboardType="number-pad"
                  />
                  {touched.bedsCount && errors.bedsCount && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.bedsCount}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                    Price Per Bed *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.pricePerBed &&
                      errors.pricePerBed &&
                      { borderColor: theme.colors.error },
                    ]}
                    placeholder="Enter price per bed"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.pricePerBed}
                    onChangeText={handleChange("pricePerBed")}
                    onBlur={handleBlur("pricePerBed")}
                    keyboardType="number-pad"
                  />
                  {touched.pricePerBed && errors.pricePerBed && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.pricePerBed}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      (!isValid || isCreating || isUpdating) &&
                      styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color={theme.colors.textInverse} />
                    ) : (
                      <Text style={[styles.submitButtonText, { color: theme.colors.textInverse }]}>
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
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  // title: { fontSize: 28, fontWeight: "bold" },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  roomTypeMeta: { fontSize: 14, marginBottom: 2 },
  roomCount: { fontSize: 12 },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: { fontSize: 20, fontWeight: "600", marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
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
  modalTitle: { fontSize: 22, fontWeight: "bold" },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  roomTypeSelector: { gap: 12 },
  roomTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  roomTypeOptionSelected: {
    borderWidth: 2,
  },
  roomTypeOptionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderWidth: 1 },
  errorText: { fontSize: 12, marginTop: 4 },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: "600" },
});
