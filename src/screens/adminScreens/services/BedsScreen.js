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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useBeds, useCreateBed, useUpdateBed, useDeleteBed } from '../../../hooks/useBeds';
import { useRooms } from '../../../hooks/useRooms';
import { bedSchema } from '../../../validations/bedSchema';

export default function BedsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBed, setEditingBed] = useState(null);

  const { data: bedsResponse, isLoading, refetch } = useBeds();
  const beds = bedsResponse?.data || [];
  const { data: rooms } = useRooms();
  const { mutate: createBed, isPending: isCreating } = useCreateBed();
  const { mutate: updateBed, isPending: isUpdating } = useUpdateBed();
  const { mutate: deleteBed } = useDeleteBed();

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
          onError: () => console.log('Update failed'),
        }
      );
    } else {
      createBed(payload, {
        onSuccess: () => {
          setModalVisible(false);
          resetForm();
        },
        onError: () => console.log('Create failed'),
      });
    }
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setModalVisible(true);
  };

  const handleDelete = (bed) => {
    Alert.alert(
      'Delete Bed',
      `Are you sure you want to delete Bed ${bed.bedNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBed(bed.id, {
              onError: () => console.log('Delete failed'),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingBed(null);
    setModalVisible(true);
  };

  const toggleOccupied = (bed) => {
    updateBed(
      { id: bed.id, data: { isOccupied: !bed.isOccupied } },
      {
        onError: () => console.log('Toggle failed'),
      }
    );
  };

  const renderBedCard = ({ item }) => (
    <View style={styles.bedCard}>
      <View style={styles.bedInfo}>
        <View style={[
          styles.bedIconContainer,
          { backgroundColor: item.isOccupied ? '#FF3B3020' : '#5856D620' }
        ]}>
          <Ionicons 
            name={item.isOccupied ? "bed" : "bed-outline"} 
            size={24} 
            color={item.isOccupied ? '#FF3B30' : '#5856D6'} 
          />
        </View>
        <View style={styles.bedDetails}>
          <Text style={styles.bedNumber}>Bed {item.bedNumber}</Text>
          <Text style={styles.bedMeta}>
            Room {item.room?.roomNumber} • Floor {item.room?.floor?.floorNumber}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.isOccupied ? '#FF3B3020' : '#34C75920' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.isOccupied ? '#FF3B30' : '#34C759' }
              ]}>
                {item.isOccupied ? 'Occupied' : 'Available'}
              </Text>
            </View>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleOccupied(item)}
        >
          <Ionicons 
            name={item.isOccupied ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={20} 
            color={item.isOccupied ? '#FF3B30' : '#34C759'} 
          />
        </TouchableOpacity>
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
        <Text style={styles.title}>Beds</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {beds?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No beds yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first bed</Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBed ? 'Edit Bed' : 'Add New Bed'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingBed(null);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                roomId: editingBed?.roomId || '',
                bedNumber: editingBed?.bedNumber?.toString() || '',
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
                      <Text style={styles.label}>Room *</Text>
                      <View style={styles.dropdownContainer}>
                        {rooms?.map((room) => (
                          <TouchableOpacity
                            key={room.id}
                            style={[
                              styles.dropdownOption,
                              values.roomId === room.id && styles.dropdownOptionSelected,
                            ]}
                            onPress={() => setFieldValue('roomId', room.id)}
                          >
                            <Ionicons 
                              name="bed" 
                              size={20} 
                              color={values.roomId === room.id ? '#FF9500' : '#999'} 
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={[
                                styles.dropdownOptionText,
                                values.roomId === room.id && styles.dropdownOptionTextSelected
                              ]}>
                                Room {room.roomNumber}
                              </Text>
                              <Text style={styles.dropdownSubtext}>
                                Floor {room.floor?.floorNumber} • {room.roomType?.name} • {room.beds?.length || 0}/{room.roomType?.bedsCount} beds
                              </Text>
                            </View>
                            {values.roomId === room.id && (
                              <Ionicons name="checkmark-circle" size={20} color="#FF9500" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                      {touched.roomId && errors.roomId && (
                        <Text style={styles.errorText}>{errors.roomId}</Text>
                      )}

                      <Text style={[styles.label, { marginTop: 20 }]}>Bed Number *</Text>
                      <TextInput
                        style={[
                          styles.input,
                          touched.bedNumber && errors.bedNumber && styles.inputError,
                        ]}
                        placeholder="Enter bed number"
                        value={values.bedNumber}
                        onChangeText={handleChange('bedNumber')}
                        onBlur={handleBlur('bedNumber')}
                        keyboardType="number-pad"
                      />
                      {touched.bedNumber && errors.bedNumber && (
                        <Text style={styles.errorText}>{errors.bedNumber}</Text>
                      )}
                    </>
                  )}

                  {editingBed && (
                    <>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Room:</Text>
                        <Text style={styles.infoValue}>Room {editingBed.room?.roomNumber}</Text>
                      </View>
                      <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Bed Number:</Text>
                        <Text style={styles.infoValue}>Bed {editingBed.bedNumber}</Text>
                      </View>
                      
                      <View style={styles.switchContainer}>
                        <View>
                          <Text style={styles.label}>Occupied Status</Text>
                          <Text style={styles.switchSubtext}>
                            {values.isOccupied ? 'Bed is occupied' : 'Bed is available'}
                          </Text>
                        </View>
                        <Switch
                          value={values.isOccupied}
                          onValueChange={(value) => setFieldValue('isOccupied', value)}
                          trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                          thumbColor={values.isOccupied ? '#fff' : '#f4f3f4'}
                        />
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      ((!isValid && !editingBed) || isCreating || isUpdating) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={(!isValid && !editingBed) || isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {editingBed ? 'Update Bed' : 'Create Bed'}
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
  bedCard: {
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
  bedInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  bedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bedDetails: { flex: 1 },
  bedNumber: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  bedMeta: { fontSize: 14, color: '#666', marginBottom: 6 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  priceText: { fontSize: 12, color: '#999', fontWeight: '600' },
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
    backgroundColor: '#FFF8F0',
    borderColor: '#FF9500',
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#666',
  },
  dropdownOptionTextSelected: {
    color: '#FF9500',
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
  infoCard: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  switchSubtext: { fontSize: 12, color: '#999', marginTop: 4 },
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
