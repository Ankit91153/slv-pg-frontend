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
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "../../../hooks/useBookings";
import { useTenantUsers } from "../../../hooks/useUsers";
import { useBeds } from "../../../hooks/useBeds";
import { bookingSchema } from "../../../validations/bookingSchema";

export default function BookingsScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const { data: bookings, isLoading, refetch } = useBookings();

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
      <View style={[styles.bookingCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
        <View style={styles.bookingInfo}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isActive ? theme.colors.success : theme.colors.textSecondary },
            ]}
          />
          <View style={styles.bookingDetails}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{item.user?.name}</Text>
            <Text style={[styles.bookingMeta, { color: theme.colors.textSecondary }]}>
              Room {item.bed?.room?.roomNumber} • Bed {item.bed?.bedNumber}
            </Text>
            <Text style={[styles.bookingMeta, { color: theme.colors.textSecondary }]}>
              Floor {item.bed?.room?.floor?.floorNumber} •{" "}
              {item.bed?.room?.roomType?.name}
            </Text>
            <View style={styles.dateContainer}>
              <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                Start: {new Date(item.startDate).toLocaleDateString()}
              </Text>
              {item.endDate && (
                <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                  End: {new Date(item.endDate).toLocaleDateString()}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? theme.colors.success + '20' : theme.colors.textSecondary + '20' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? theme.colors.success : theme.colors.textSecondary },
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
              style={[styles.actionButton, { backgroundColor: theme.colors.background }]}
              onPress={() => handleStatusUpdate(item, "COMPLETED")}
            >
              <Ionicons name="checkmark-done" size={20} color={theme.colors.success} />
            </TouchableOpacity>
          )}
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
        {/* <Text style={[styles.title, { color: theme.colors.text }]}>Bookings</Text> */}
        <View />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </View>

      {bookings?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No bookings yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create New Booking</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingBooking(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
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
                  <Text style={[styles.label, { color: theme.colors.text }]}>Select User *</Text>
                  {users.length === 0 ? (
                    <View style={[styles.noDataContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                      <Ionicons
                        name="people-outline"
                        size={24}
                        color={theme.colors.warning}
                      />
                      <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>
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
                              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                              values.userId === user.id && {
                                borderColor: theme.colors.primary,
                                backgroundColor: theme.colors.primary + '10',
                                borderWidth: 2,
                              },
                            ]}
                            onPress={() => setFieldValue("userId", user.id)}
                          >
                            <Ionicons
                              name="person"
                              size={20}
                              color={
                                values.userId === user.id ? theme.colors.primary : theme.colors.textSecondary
                              }
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  { color: theme.colors.textSecondary },
                                  values.userId === user.id && {
                                    color: theme.colors.primary,
                                    fontWeight: '600',
                                  },
                                ]}
                              >
                                {user.name}
                              </Text>
                              <Text style={[styles.dropdownSubtext, { color: theme.colors.textSecondary }]}>
                                {user.email}
                              </Text>
                            </View>
                            {values.userId === user.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={theme.colors.primary}
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                  {touched.userId && errors.userId && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.userId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                    Filter by Room Type (Optional)
                  </Text>
                  <View style={styles.filterContainer}>
                    <TouchableOpacity
                      style={[
                        styles.filterChip,
                        { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                        !selectedRoomType && {
                          backgroundColor: theme.colors.primary,
                          borderColor: theme.colors.primary,
                        },
                      ]}
                      onPress={() => {
                        setSelectedRoomType("");
                        setFieldValue("bedId", "");
                      }}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: theme.colors.textSecondary },
                          !selectedRoomType && {
                            color: theme.colors.textInverse,
                            fontWeight: '600',
                          },
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
                          { borderColor: theme.colors.border, backgroundColor: theme.colors.background },
                          selectedRoomType === type && {
                            backgroundColor: theme.colors.primary,
                            borderColor: theme.colors.primary,
                          },
                        ]}
                        onPress={() => {
                          setSelectedRoomType(type);
                          setFieldValue("bedId", "");
                        }}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            { color: theme.colors.textSecondary },
                            selectedRoomType === type && {
                              color: theme.colors.textInverse,
                              fontWeight: '600',
                            },
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                    Select Available Bed *
                  </Text>
                  {availableBeds.length === 0 ? (
                    <View style={[styles.noBedsContainer, { backgroundColor: theme.colors.warning + "10", borderColor: theme.colors.warning }]}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={32}
                        color={theme.colors.warning}
                      />
                      <Text style={[styles.noBedsText, { color: theme.colors.warning }]}>No available beds</Text>
                      <Text style={[styles.noBedsSubtext, { color: theme.colors.textSecondary }]}>
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
                              { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                              values.bedId === bed.id && {
                                borderColor: theme.colors.success,
                                backgroundColor: theme.colors.success + '10',
                                borderWidth: 2,
                              },
                            ]}
                            onPress={() => setFieldValue("bedId", bed.id)}
                          >
                            <Ionicons
                              name="bed"
                              size={20}
                              color={
                                values.bedId === bed.id ? theme.colors.success : theme.colors.textSecondary
                              }
                            />
                            <View style={{ flex: 1 }}>
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  { color: theme.colors.textSecondary },
                                  values.bedId === bed.id && {
                                    color: theme.colors.success,
                                    fontWeight: '600',
                                  },
                                ]}
                              >
                                Bed {bed.bedNumber} - Room {bed.roomNumber}
                              </Text>
                              <Text style={[styles.dropdownSubtext, { color: theme.colors.textSecondary }]}>
                                Floor {bed.floorNumber} • {bed.roomType} • ₹
                                {bed.price}
                              </Text>
                            </View>
                            {values.bedId === bed.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={theme.colors.success}
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                  {touched.bedId && errors.bedId && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.bedId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>
                    Start Date *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.startDate &&
                      errors.startDate &&
                      { borderColor: theme.colors.error },
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.startDate}
                    onChangeText={handleChange("startDate")}
                    onBlur={handleBlur("startDate")}
                  />
                  {touched.startDate && errors.startDate && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.startDate}</Text>
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
  bookingCard: {
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
  bookingInfo: { flexDirection: "row", alignItems: "flex-start", flex: 1 },
  statusIndicator: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    marginRight: 12,
  },
  bookingDetails: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  bookingMeta: { fontSize: 14, marginBottom: 2 },
  dateContainer: { marginTop: 8, marginBottom: 8 },
  dateText: { fontSize: 12, marginBottom: 2 },
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
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: "600" },
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
  },
  filterChipSelected: {
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    fontWeight: "600",
  },
  noBedsContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  noBedsText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  noBedsSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  noDataContainer: {
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  noDataText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
