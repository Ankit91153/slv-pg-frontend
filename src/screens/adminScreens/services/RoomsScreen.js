import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useTheme } from '../../../context/ThemeContext';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../../hooks/useRooms';
import { useFloors } from '../../../hooks/useFloors';
import { useRoomTypes } from '../../../hooks/useRoomTypes';
import { roomSchema } from '../../../validations/roomSchema';

export default function RoomsScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const { data: rooms, isLoading, refetch } = useRooms();
  const { data: floors } = useFloors();
  const { data: roomTypes } = useRoomTypes();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      floorId: values.floorId,
      roomTypeId: values.roomTypeId,
      roomNumber: values.roomNumber,
    };

    if (editingRoom) {
      updateRoom(
        { id: editingRoom.id, data: payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            setEditingRoom(null);
            resetForm();
          },
          onError: () => console.log('Update failed'),
        }
      );
    } else {
      createRoom(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
        },
        onError: () => console.log('Create failed'),
      });
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setModalVisible(true);
  };

  const handleDelete = (room) => {
    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete Room ${room.roomNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteRoom(room.id, {
              onError: () => console.log('Delete failed'),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingRoom(null);
    setModalVisible(true);
  };

  const renderRoomCard = ({ item }) => (
    <View style={[styles.roomCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
      <View style={styles.roomInfo}>
        <View style={[styles.roomIconContainer, { backgroundColor: theme.colors.warning + '20' }]}>
          <Ionicons name="bed" size={24} color={theme.colors.warning} />
        </View>
        <View style={styles.roomDetails}>
          <Text style={[styles.roomNumber, { color: theme.colors.text }]}>Room {item.roomNumber}</Text>
          <Text style={[styles.roomMeta, { color: theme.colors.textSecondary }]}>
            Floor {item.floor?.floorNumber} • {item.roomType?.name}
          </Text>
          <Text style={[styles.bedCount, { color: theme.colors.textSecondary }]}>
            {item.beds?.length || 0} beds • ₹{item.roomType?.pricePerBed}/bed
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
        {/* <Text style={[styles.title, { color: theme.colors.text }]}>Rooms</Text> */}
        <View />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color={theme.colors.textInverse} />
        </TouchableOpacity>
      </View>

      {rooms?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bed-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No rooms yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Tap + to add your first room</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoomCard}
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
          setEditingRoom(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoom(null);
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                floorId: editingRoom?.floorId || '',
                roomTypeId: editingRoom?.roomTypeId || '',
                roomNumber: editingRoom?.roomNumber || '',
              }}
              validationSchema={roomSchema}
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
                  <Text style={[styles.label, { color: theme.colors.text }]}>Floor *</Text>
                  <View style={styles.dropdownContainer}>
                    {floors?.map((floor) => (
                      <TouchableOpacity
                        key={floor.id}
                        style={[
                          styles.dropdownOption,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border
                          },
                          values.floorId === floor.id && {
                            backgroundColor: theme.colors.primary + '10',
                            borderColor: theme.colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => setFieldValue('floorId', floor.id)}
                      >
                        <Ionicons
                          name="layers"
                          size={20}
                          color={values.floorId === floor.id ? theme.colors.primary : theme.colors.textSecondary}
                        />
                        <Text style={[
                          styles.dropdownOptionText,
                          { color: theme.colors.textSecondary },
                          values.floorId === floor.id && {
                            color: theme.colors.primary,
                            fontWeight: '600',
                          }
                        ]}>
                          Floor {floor.floorNumber}
                        </Text>
                        {values.floorId === floor.id && (
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.floorId && errors.floorId && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.floorId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>Room Type *</Text>
                  <View style={styles.dropdownContainer}>
                    {roomTypes?.map((roomType) => (
                      <TouchableOpacity
                        key={roomType.id}
                        style={[
                          styles.dropdownOption,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border
                          },
                          values.roomTypeId === roomType.id && {
                            backgroundColor: theme.colors.success + '10',
                            borderColor: theme.colors.success,
                            borderWidth: 2,
                          },
                        ]}
                        onPress={() => setFieldValue('roomTypeId', roomType.id)}
                      >
                        <Ionicons
                          name="grid"
                          size={20}
                          color={values.roomTypeId === roomType.id ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[
                            styles.dropdownOptionText,
                            { color: theme.colors.textSecondary },
                            values.roomTypeId === roomType.id && {
                              color: theme.colors.success,
                              fontWeight: '600',
                            }
                          ]}>
                            {roomType.name}
                          </Text>
                          <Text style={[styles.dropdownSubtext, { color: theme.colors.textSecondary }]}>
                            {roomType.bedsCount} beds • ₹{roomType.pricePerBed}/bed
                          </Text>
                        </View>
                        {values.roomTypeId === roomType.id && (
                          <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.roomTypeId && errors.roomTypeId && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.roomTypeId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20, color: theme.colors.text }]}>Room Number *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                        color: theme.colors.text
                      },
                      touched.roomNumber && errors.roomNumber && { borderColor: theme.colors.error },
                    ]}
                    placeholder="Enter room number (e.g., 101)"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.roomNumber}
                    onChangeText={handleChange('roomNumber')}
                    onBlur={handleBlur('roomNumber')}
                  />
                  {touched.roomNumber && errors.roomNumber && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.roomNumber}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: theme.colors.primary },
                      (!isValid || isCreating || isUpdating) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color={theme.colors.textInverse} />
                    ) : (
                      <Text style={[styles.submitButtonText, { color: theme.colors.textInverse }]}>
                        {editingRoom ? 'Update Room' : 'Create Room'}
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  // title: { fontSize: 28, fontWeight: 'bold' },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContainer: { padding: 20, paddingTop: 0 },
  roomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  roomIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomDetails: { flex: 1 },
  roomNumber: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  roomMeta: { fontSize: 14, marginBottom: 2 },
  bedCount: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: { fontSize: 20, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  dropdownContainer: { gap: 8 },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  dropdownOptionTextSelected: {
    fontWeight: '600',
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 16, fontWeight: '600' },
});
