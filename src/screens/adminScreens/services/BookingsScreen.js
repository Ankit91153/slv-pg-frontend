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
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "../../../hooks/useBookings";
import { useTenantUsers } from "../../../hooks/useUsers";
import { useBeds } from "../../../hooks/useBeds";
import { bookingSchema } from "../../../validations/bookingSchema";

export default function BookingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const { data: bookings, isLoading, refetch } = useBookings();

  console.log(bookings,"BOOOOOOOO");
  
  const { data: usersResponse } = useTenantUsers();
  const users = usersResponse?.data || [];

  // Fetch beds with optional room type filter
  const bedFilters = selectedRoomType ? { roomType: selectedRoomType } : {};
  const { data: bedsResponse } = useBeds(bedFilters);
  const beds = bedsResponse?.data || [];

  // Filter only available (unoccupied) beds
  const availableBeds = beds.filter((bed) => !bed.isOccupied);

  // Get unique room types from all beds for filter dropdown
  const roomTypes = [...new Set(beds.map((bed) => bed.roomType))].filter(
    Boolean
  );
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: updateBooking, isPending: isUpdating } = useUpdateBooking();
  const { mutate: deleteBooking } = useDeleteBooking();

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      userId: values.userId,
      bedId: values.bedId,
      startDate: values.startDate,
    };

    createBooking(payload, {
      onSuccess: () => {
        setModalVisible(false);
        resetForm();
      },
      onError: () => console.log("Create failed"),
    });
  };

  const handleStatusUpdate = (booking, newStatus) => {
    Alert.alert("Update Status", `Mark booking as ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          updateBooking(
            { id: booking.id, data: { status: newStatus } },
            {
              onError: () => console.log("Update failed"),
            }
          );
        },
      },
    ]);
  };

  const handleDelete = (booking) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBooking(booking.id, {
              onError: () => console.log("Delete failed"),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingBooking(null);
    setModalVisible(true);
  };

  const renderBookingCard = ({ item }) => {
    const isActive = item.status === "ACTIVE";

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingInfo}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isActive ? "#34C759" : "#999" },
            ]}
          />
          <View style={styles.bookingDetails}>
            <Text style={styles.userName}>{item.user?.name}</Text>
            <Text style={styles.bookingMeta}>
              Room {item.bed?.room?.roomNumber} • Bed {item.bed?.bedNumber}
            </Text>
            <Text style={styles.bookingMeta}>
              Floor {item.bed?.room?.floor?.floorNumber} •{" "}
              {item.bed?.room?.roomType?.name}
            </Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                Start: {new Date(item.startDate).toLocaleDateString()}
              </Text>
              {item.endDate && (
                <Text style={styles.dateText}>
                  End: {new Date(item.endDate).toLocaleDateString()}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? "#34C75920" : "#99999920" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? "#34C759" : "#999" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.actions}>
          {isActive && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleStatusUpdate(item, "COMPLETED")}
            >
              <Ionicons name="checkmark-done" size={20} color="#34C759" />
            </TouchableOpacity>
          )}
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
        <Text style={styles.title}>Bookings</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {bookings?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>
            Tap + to create your first booking
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
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
          setEditingBooking(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Booking</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingBooking(null);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                userId: "",
                bedId: "",
                startDate: new Date().toISOString().split("T")[0],
              }}
              validationSchema={bookingSchema}
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
                  <Text style={styles.label}>Select User *</Text>
                  {users.length === 0 ? (
                    <View style={styles.noDataContainer}>
                      <Ionicons
                        name="people-outline"
                        size={24}
                        color="#FF9500"
                      />
                      <Text style={styles.noDataText}>
                        No tenant users available
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      style={styles.dropdownScrollContainer}
                      nestedScrollEnabled
                    >
                      <View style={styles.dropdownContainer}>
                        {users.map((user) => (
                          <TouchableOpacity
                            key={user.id}
                            style={[
                              styles.dropdownOption,
                              values.userId === user.id &&
                                styles.dropdownOptionSelected,
                            ]}
                            onPress={() => setFieldValue("userId", user.id)}
                          >
                            <Ionicons
                              name="person"
                              size={20}
                              color={
                                values.userId === user.id ? "#007AFF" : "#999"
                              }
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  values.userId === user.id &&
                                    styles.dropdownOptionTextSelected,
                                ]}
                              >
                                {user.name}
                              </Text>
                              <Text style={styles.dropdownSubtext}>
                                {user.email}
                              </Text>
                            </View>
                            {values.userId === user.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#007AFF"
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                  {touched.userId && errors.userId && (
                    <Text style={styles.errorText}>{errors.userId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Filter by Room Type (Optional)
                  </Text>
                  <View style={styles.filterContainer}>
                    <TouchableOpacity
                      style={[
                        styles.filterChip,
                        !selectedRoomType && styles.filterChipSelected,
                      ]}
                      onPress={() => {
                        setSelectedRoomType("");
                        setFieldValue("bedId", "");
                      }}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          !selectedRoomType && styles.filterChipTextSelected,
                        ]}
                      >
                        All
                      </Text>
                    </TouchableOpacity>
                    {roomTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.filterChip,
                          selectedRoomType === type &&
                            styles.filterChipSelected,
                        ]}
                        onPress={() => {
                          setSelectedRoomType(type);
                          setFieldValue("bedId", "");
                        }}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedRoomType === type &&
                              styles.filterChipTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Select Available Bed *
                  </Text>
                  {availableBeds.length === 0 ? (
                    <View style={styles.noBedsContainer}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={32}
                        color="#FF9500"
                      />
                      <Text style={styles.noBedsText}>No available beds</Text>
                      <Text style={styles.noBedsSubtext}>
                        {selectedRoomType
                          ? `No available ${selectedRoomType} beds at the moment`
                          : "All beds are currently occupied"}
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      style={styles.dropdownScrollContainer}
                      nestedScrollEnabled
                    >
                      <View style={styles.dropdownContainer}>
                        {availableBeds.map((bed) => (
                          <TouchableOpacity
                            key={bed.id}
                            style={[
                              styles.dropdownOption,
                              values.bedId === bed.id &&
                                styles.dropdownOptionSelected,
                            ]}
                            onPress={() => setFieldValue("bedId", bed.id)}
                          >
                            <Ionicons
                              name="bed"
                              size={20}
                              color={
                                values.bedId === bed.id ? "#34C759" : "#999"
                              }
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  values.bedId === bed.id &&
                                    styles.dropdownOptionTextSelected,
                                ]}
                              >
                                Bed {bed.bedNumber} - Room {bed.roomNumber}
                              </Text>
                              <Text style={styles.dropdownSubtext}>
                                Floor {bed.floorNumber} • {bed.roomType} • ₹
                                {bed.price}
                              </Text>
                            </View>
                            {values.bedId === bed.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#34C759"
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                  {touched.bedId && errors.bedId && (
                    <Text style={styles.errorText}>{errors.bedId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Start Date *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.startDate &&
                        errors.startDate &&
                        styles.inputError,
                    ]}
                    placeholder="YYYY-MM-DD"
                    value={values.startDate}
                    onChangeText={handleChange("startDate")}
                    onBlur={handleBlur("startDate")}
                  />
                  {touched.startDate && errors.startDate && (
                    <Text style={styles.errorText}>{errors.startDate}</Text>
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
                        Create Booking
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
  bookingCard: {
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
  bookingInfo: { flexDirection: "row", alignItems: "flex-start", flex: 1 },
  statusIndicator: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    marginRight: 12,
  },
  bookingDetails: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 4 },
  bookingMeta: { fontSize: 14, color: "#666", marginBottom: 2 },
  dateContainer: { marginTop: 8, marginBottom: 8 },
  dateText: { fontSize: 12, color: "#999", marginBottom: 2 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "600" },
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
    maxHeight: "85%",
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
  dropdownScrollContainer: {
    maxHeight: 200,
    marginBottom: 8,
  },
  dropdownContainer: { gap: 8 },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#F9F9F9",
    gap: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: "#F0F8FF",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#666",
  },
  dropdownOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  dropdownSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
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
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F9F9F9",
  },
  filterChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  noBedsContainer: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  noBedsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
    marginTop: 12,
  },
  noBedsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  noDataContainer: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
});
