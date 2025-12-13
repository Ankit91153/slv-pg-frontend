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
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../../../hooks/useRooms';
import { useFloors } from '../../../hooks/useFloors';
import { useRoomTypes } from '../../../hooks/useRoomTypes';
import { roomSchema } from '../../../validations/roomSchema';

export default function RoomsScreen() {
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
    <View style={styles.roomCard}>
      <View style={styles.roomInfo}>
        <View style={styles.roomIconContainer}>
          <Ionicons name="bed" size={24} color="#FF9500" />
        </View>
        <View style={styles.roomDetails}>
          <Text style={styles.roomNumber}>Room {item.roomNumber}</Text>
          <Text style={styles.roomMeta}>
            Floor {item.floor?.floorNumber} • {item.roomType?.name}
          </Text>
          <Text style={styles.bedCount}>
            {item.beds?.length || 0} beds • ₹{item.roomType?.pricePerBed}/bed
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
        <Text style={styles.title}>Rooms</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {rooms?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bed-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No rooms yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first room</Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingRoom(null);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
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
                  <Text style={styles.label}>Floor *</Text>
                  <View style={styles.dropdownContainer}>
                    {floors?.map((floor) => (
                      <TouchableOpacity
                        key={floor.id}
                        style={[
                          styles.dropdownOption,
                          values.floorId === floor.id && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => setFieldValue('floorId', floor.id)}
                      >
                        <Ionicons 
                          name="layers" 
                          size={20} 
                          color={values.floorId === floor.id ? '#007AFF' : '#999'} 
                        />
                        <Text style={[
                          styles.dropdownOptionText,
                          values.floorId === floor.id && styles.dropdownOptionTextSelected
                        ]}>
                          Floor {floor.floorNumber}
                        </Text>
                        {values.floorId === floor.id && (
                          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.floorId && errors.floorId && (
                    <Text style={styles.errorText}>{errors.floorId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>Room Type *</Text>
                  <View style={styles.dropdownContainer}>
                    {roomTypes?.map((roomType) => (
                      <TouchableOpacity
                        key={roomType.id}
                        style={[
                          styles.dropdownOption,
                          values.roomTypeId === roomType.id && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => setFieldValue('roomTypeId', roomType.id)}
                      >
                        <Ionicons 
                          name="grid" 
                          size={20} 
                          color={values.roomTypeId === roomType.id ? '#34C759' : '#999'} 
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[
                            styles.dropdownOptionText,
                            values.roomTypeId === roomType.id && styles.dropdownOptionTextSelected
                          ]}>
                            {roomType.name}
                          </Text>
                          <Text style={styles.dropdownSubtext}>
                            {roomType.bedsCount} beds • ₹{roomType.pricePerBed}/bed
                          </Text>
                        </View>
                        {values.roomTypeId === roomType.id && (
                          <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  {touched.roomTypeId && errors.roomTypeId && (
                    <Text style={styles.errorText}>{errors.roomTypeId}</Text>
                  )}

                  <Text style={[styles.label, { marginTop: 20 }]}>Room Number *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.roomNumber && errors.roomNumber && styles.inputError,
                    ]}
                    placeholder="Enter room number (e.g., 101)"
                    value={values.roomNumber}
                    onChangeText={handleChange('roomNumber')}
                    onBlur={handleBlur('roomNumber')}
                  />
                  {touched.roomNumber && errors.roomNumber && (
                    <Text style={styles.errorText}>{errors.roomNumber}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!isValid || isCreating || isUpdating) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
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
    backgroundColor: '#FF950020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomDetails: { flex: 1 },
  roomNumber: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  roomMeta: { fontSize: 14, color: '#666', marginBottom: 2 },
  bedCount: { fontSize: 12, color: '#999' },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: { fontSize: 20, fontWeight: '600', color: '#999', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#BBB', marginTop: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
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
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  dropdownContainer: { gap: 8 },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
    gap: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dropdownSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonDisabled: { backgroundColor: '#A0A0A0', opacity: 0.6 },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
