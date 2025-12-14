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
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useTheme } from "../../../context/ThemeContext";
import {
  useBeds,
  useCreateBed,
  useUpdateBed,
  useDeleteBed,
} from "../../../hooks/useBeds";
import { useAvailableRooms } from "../../../hooks/useRooms";
import { useFloors } from "../../../hooks/useFloors";
import { useRoomTypes } from "../../../hooks/useRoomTypes";
import { bedSchema } from "../../../validations/bedSchema";

export default function BedsScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  const { data: bedsResponse, isLoading, refetch } = useBeds(filters);
  const beds = bedsResponse?.data || [];
  const { data: availableRoomsResponse } = useAvailableRooms();
  const availableRooms = availableRoomsResponse?.data || [];
  const { data: floorsResponse } = useFloors();
  const floors = floorsResponse || [];
  const { data: roomTypesResponse } = useRoomTypes();
  const { mutate: createBed, isPending: isCreating } = useCreateBed();
  const { mutate: updateBed, isPending: isUpdating } = useUpdateBed();
  const { mutate: deleteBed } = useDeleteBed();

  const applyFilters = (floorNumber, roomType) => {
    const newFilters = {};
    if (floorNumber) newFilters.floorNumber = floorNumber;
    if (roomType) newFilters.roomType = roomType;
    setFilters(newFilters);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({});
    setFilterModalVisible(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      roomId: values.roomId,
      bedNumber: Number(values.bedNumber),
    };

    if (editingBed) {
      // For update, only send isOccupied
      updateBed(
        { id: editingBed.id, data: { isOccupied: values.isOccupied } },
        {
          onSuccess: () => {
            setModalVisible(false);
            setEditingBed(null);
            resetForm();
          },
          onError: () => console.log("Update failed"),
        }
      );
    } else {
      createBed(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
        },
        onError: () => console.log("Create failed"),
      });
    }
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setModalVisible(true);
  };

  const handleDelete = (bed) => {
    Alert.alert(
      "Delete Bed",
      `Are you sure you want to delete Bed ${bed.bedNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBed(bed.id, {
              onError: () => console.log("Delete failed"),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    // Check if there are available rooms before opening modal
    if (availableRooms.length === 0) {
      Alert.alert(
        "No Available Rooms",
        "All rooms are at full capacity. Please add more rooms first or increase room capacity.",
        [{ text: "OK" }]
      );
      return;
    }

    setEditingBed(null);
    setModalVisible(true);
  };

  const toggleOccupied = (bed) => {
    updateBed(
      { id: bed.id, data: { isOccupied: !bed.isOccupied } },
      {
        onError: () => console.log("Toggle failed"),
      }
    );
  };

  const renderBedCard = ({ item }) => (
    <View style={[styles.bedCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
      <View style={styles.bedInfo}>
        <View
          style={[
            styles.bedIconContainer,
            { backgroundColor: item.isOccupied ? theme.colors.error + "20" : theme.colors.info + "20" },
          ]}
        >
          <Ionicons
            name={item.isOccupied ? "bed" : "bed-outline"}
            size={24}
            color={item.isOccupied ? theme.colors.error : theme.colors.info}
          />
        </View>
        <View style={styles.bedDetails}>
          <Text style={[styles.bedNumber, { color: theme.colors.text }]}>Bed {item.bedNumber}</Text>
          <Text style={[styles.bedMeta, { color: theme.colors.textSecondary }]}>
            Room {item.roomNumber} • Floor {item.floorNumber}
          </Text>
          <Text style={[styles.roomTypeText, { color: theme.colors.textSecondary }]}>{item.roomType}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: item.isOccupied ? theme.colors.error + "20" : theme.colors.success + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: item.isOccupied ? theme.colors.error : theme.colors.success },
                ]}
              >
                {item.isOccupied ? "Occupied" : "Available"}
              </Text>
            </View>
            <Text style={[styles.priceText, { color: theme.colors.textSecondary }]}>₹{item.price}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
          onPress={() => toggleOccupied(item)}
        >
          <Ionicons
            name={
              item.isOccupied ? "checkmark-circle" : "checkmark-circle-outline"
            }
            size={20}
            color={item.isOccupied ? theme.colors.error : theme.colors.success}
          />
        </TouchableOpacity>
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
        {/* <Text style={[styles.title, { color: theme.colors.text }]}>Beds</Text> */}
        <View />
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.primary },
              Object.keys(filters).length > 0 && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name="filter"
              size={20}
              color={Object.keys(filters).length > 0 ? theme.colors.textInverse : theme.colors.primary}
            />
            {Object.keys(filters).length > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: theme.colors.error }]}>
                <Text style={[styles.filterBadgeText, { color: theme.colors.textInverse }]}>
                  {Object.keys(filters).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddNew}>
            <Ionicons name="add" size={24} color={theme.colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {beds?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No beds yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Tap + to add your first bed</Text>
        </View>
      ) : (
        <FlatList
          data={beds}
          renderItem={renderBedCard}
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
          setEditingBed(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingBed ? "Edit Bed" : "Add New Bed"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingBed(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                roomId: editingBed?.roomId || "",
                bedNumber: editingBed?.bedNumber?.toString() || "",
                isOccupied: editingBed?.isOccupied || false,
              }}
              validationSchema={editingBed ? null : bedSchema}
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
                setFieldValue,
              }) => (
                <ScrollView style={styles.form}>
                  {!editingBed && (
                    <>
                      <Text style={[styles.label, { color: theme.colors.text }]}>
                        Select Room (Only rooms with available capacity) *
                      </Text>
                      {availableRooms.length === 0 ? (
                        <View style={[styles.noRoomsContainer, { backgroundColor: theme.colors.warning + "10", borderColor: theme.colors.warning }]}>
                          <Ionicons
                            name="alert-circle-outline"
                            size={32}
                            color={theme.colors.warning}
                          />
                          <Text style={[styles.noRoomsText, { color: theme.colors.warning }]}>
                            No rooms with available bed capacity
                          </Text>
                          <Text style={[styles.noRoomsSubtext, { color: theme.colors.textSecondary }]}>
                            All rooms are at full capacity
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.dropdownContainer}>
                          {availableRooms?.map((room) => (
                            <TouchableOpacity
                              key={room.id}
                              style={[
                                styles.dropdownOption,
                                { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                                values.roomId === room.id && {
                                  borderColor: theme.colors.success,
                                  backgroundColor: theme.colors.success + '10',
                                  borderWidth: 2,
                                },
                              ]}
                              onPress={() => setFieldValue("roomId", room.id)}
                            >
                              <Ionicons
                                name="bed"
                                size={20}
                                color={
                                  values.roomId === room.id ? theme.colors.success : theme.colors.textSecondary
                                }
                              />
                              <View style={{ flex: 1 }}>
                                <Text
                                  style={[
                                    styles.dropdownOptionText,
                                    { color: theme.colors.textSecondary },
                                    values.roomId === room.id && {
                                      color: theme.colors.success,
                                      fontWeight: '600',
                                    },
                                  ]}
                                >
                                  Room {room.roomNumber}
                                </Text>
                                <Text style={[styles.dropdownSubtext, { color: theme.colors.textSecondary }]}>
                                  Floor {room.floorNumber} • {room.roomTypeName}
                                </Text>
                                <View style={[styles.capacityBadge, { backgroundColor: theme.colors.success + "15" }]}>
                                  <Ionicons
                                    name="add-circle"
                                    size={14}
                                    color={theme.colors.success}
                                  />
                                  <Text style={[styles.capacityText, { color: theme.colors.success }]}>
                                    {room.availableBeds}{" "}
                                    {room.availableBeds === 1 ? "bed" : "beds"}{" "}
                                    available ({room.currentBeds}/
                                    {room.totalBeds})
                                  </Text>
                                </View>
                              </View>
                              {values.roomId === room.id && (
                                <Ionicons
                                  name="checkmark-circle"
                                  size={20}
                                  color={theme.colors.success}
                                />
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                      {touched.roomId && errors.roomId && (
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.roomId}</Text>
                      )}

                      <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                        Bed Number *
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                            color: theme.colors.text
                          },
                          touched.bedNumber &&
                          errors.bedNumber &&
                          { borderColor: theme.colors.error },
                        ]}
                        placeholder="Enter bed number"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={values.bedNumber}
                        onChangeText={handleChange("bedNumber")}
                        onBlur={handleBlur("bedNumber")}
                        keyboardType="number-pad"
                      />
                      {touched.bedNumber && errors.bedNumber && (
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.bedNumber}</Text>
                      )}
                    </>
                  )}

                  {editingBed && (
                    <>
                      <View style={[styles.infoCard, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Room:</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                          Room {editingBed.room?.roomNumber}
                        </Text>
                      </View>
                      <View style={[styles.infoCard, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Bed Number:</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                          Bed {editingBed.bedNumber}
                        </Text>
                      </View>

                      <View style={[styles.switchContainer, { backgroundColor: theme.colors.background }]}>
                        <View>
                          <Text style={[styles.label, { marginBottom: 0, color: theme.colors.text }]}>Occupied Status</Text>
                          <Text style={[styles.switchSubtext, { color: theme.colors.textSecondary }]}>
                            {values.isOccupied
                              ? "Bed is occupied"
                              : "Bed is available"}
                          </Text>
                        </View>
                        <Switch
                          value={values.isOccupied}
                          onValueChange={(value) =>
                            setFieldValue("isOccupied", value)
                          }
                          trackColor={{ false: theme.colors.border, true: theme.colors.success }}
                          thumbColor={theme.colors.card}
                        />
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      ((!isValid && !editingBed) || isCreating || isUpdating) &&
                      styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={
                      (!isValid && !editingBed) || isCreating || isUpdating
                    }
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color={theme.colors.textInverse} />
                    ) : (
                      <Text style={[styles.submitButtonText, { color: theme.colors.textInverse }]}>
                        {editingBed ? "Update Bed" : "Create Bed"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filter Beds</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Floor Number</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                    !filters.floorNumber && {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primary + '10',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => applyFilters(null, filters.roomType)}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    { color: theme.colors.textSecondary },
                    !filters.floorNumber && { color: theme.colors.primary, fontWeight: '600' }
                  ]}>All Floors</Text>
                </TouchableOpacity>
                {floors?.map((floor) => (
                  <TouchableOpacity
                    key={floor.id}
                    style={[
                      styles.dropdownOption,
                      { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                      filters.floorNumber === floor.floorNumber.toString() && {
                        borderColor: theme.colors.primary,
                        backgroundColor: theme.colors.primary + '10',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() =>
                      applyFilters(
                        floor.floorNumber.toString(),
                        filters.roomType
                      )
                    }
                  >
                    <Ionicons name="layers" size={20} color={filters.floorNumber === floor.floorNumber.toString() ? theme.colors.primary : theme.colors.textSecondary} />
                    <Text style={[
                      styles.dropdownOptionText,
                      { color: theme.colors.textSecondary },
                      filters.floorNumber === floor.floorNumber.toString() && { color: theme.colors.primary, fontWeight: '600' }
                    ]}>
                      Floor {floor.floorNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>Room Type</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownOption,
                    { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                    !filters.roomType && {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primary + '10',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => applyFilters(filters.floorNumber, null)}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    { color: theme.colors.textSecondary },
                    !filters.roomType && { color: theme.colors.primary, fontWeight: '600' }
                  ]}>All Room Types</Text>
                </TouchableOpacity>
                {roomTypesResponse?.map((roomType) => (
                  <TouchableOpacity
                    key={roomType.id}
                    style={[
                      styles.dropdownOption,
                      { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                      filters.roomType === roomType.name && {
                        borderColor: theme.colors.success,
                        backgroundColor: theme.colors.success + '10',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() =>
                      applyFilters(filters.floorNumber, roomType.name)
                    }
                  >
                    <Ionicons name="grid" size={20} color={filters.roomType === roomType.name ? theme.colors.success : theme.colors.textSecondary} />
                    <Text style={[
                      styles.dropdownOptionText,
                      { color: theme.colors.textSecondary },
                      filters.roomType === roomType.name && { color: theme.colors.success, fontWeight: '600' }
                    ]}>
                      {roomType.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: theme.colors.error }]}
                onPress={clearFilters}
              >
                <Text style={[styles.clearButtonText, { color: theme.colors.textInverse }]}>Clear All Filters</Text>
              </TouchableOpacity>
            </ScrollView>
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
  headerActions: { flexDirection: "row", gap: 10 },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  // filterButtonActive: {
  //   backgroundColor: "#007AFF",
  // },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
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
  bedCard: {
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
  bedInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  bedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bedDetails: { flex: 1 },
  bedNumber: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  bedMeta: { fontSize: 14, marginBottom: 4 },
  roomTypeText: { fontSize: 12, marginBottom: 6 },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  priceText: { fontSize: 12, fontWeight: "600" },
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
    maxHeight: "85%",
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
  dropdownContainer: { gap: 8 },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  dropdownOptionSelected: {
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  dropdownOptionTextSelected: {
    fontWeight: "600",
  },
  dropdownSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  capacityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  capacityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  noRoomsContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  noRoomsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  noRoomsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: { borderWidth: 1 },
  errorText: { fontSize: 12, marginTop: 4 },
  infoCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  switchSubtext: { fontSize: 12, marginTop: 4 },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: "600" },
  clearButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  clearButtonText: { fontSize: 16, fontWeight: "600" },
});
