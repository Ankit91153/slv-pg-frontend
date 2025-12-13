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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { useFloors, useCreateFloor, useUpdateFloor, useDeleteFloor } from '../../../hooks/useFloors';
import { floorSchema } from '../../../validations/floorSchema';

export default function FloorsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);

  const { data: floors, isLoading, refetch } = useFloors();
  const { mutate: createFloor, isPending: isCreating } = useCreateFloor();
  const { mutate: updateFloor, isPending: isUpdating } = useUpdateFloor();
  const { mutate: deleteFloor, isPending: isDeleting } = useDeleteFloor();

 const handleSubmit = (values, { resetForm }) => {
  const payload = {
    floorNumber: Number(values.floorNumber),
  };

  if (editingFloor) {
    updateFloor(
      { id: editingFloor.id, data: payload },
      {
        onSuccess: () => {
          setModalVisible(false);
          setEditingFloor(null);
          resetForm();
        },
      }
    );
  } else {
    createFloor(payload, {
      onSuccess: () => {
        setModalVisible(false);
        resetForm();
      },
    });
  }
};
 

  const handleEdit = (floor) => {
    setEditingFloor(floor);
    setModalVisible(true);
  };

  const handleDelete = (floor) => {
    Alert.alert(
      'Delete Floor',
      `Are you sure you want to delete Floor ${floor.floorNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteFloor(floor.id, {
              onError: () => console.log('Delete failed'),
            });
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    setEditingFloor(null);
    setModalVisible(true);
  };

  
  const renderFloorCard = ({ item }) => (
    <View style={styles.floorCard}>
      <View style={styles.floorInfo}>
        <View style={styles.floorIconContainer}>
          <Ionicons name="layers" size={24} color="#007AFF" />
        </View>
        <View style={styles.floorDetails}>
          <Text style={styles.floorNumber}>Floor {item.floorNumber}</Text>
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
        <Text style={styles.title}>Floors</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {floors?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="layers-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No floors yet</Text>
          <Text style={styles.emptySubtext}>Tap + to add your first floor</Text>
        </View>
      ) : (
        <FlatList
          data={floors}
          renderItem={renderFloorCard}
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
          setEditingFloor(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFloor ? 'Edit Floor' : 'Add New Floor'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingFloor(null);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                floorNumber: Number(editingFloor?.floorNumber) || '',
              }}
              validationSchema={floorSchema}
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
                <View style={styles.form}>
                  <Text style={styles.label}>Floor Number</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.floorNumber && errors.floorNumber && styles.inputError,
                    ]}
                    placeholder="Enter floor number"
                    value={values.floorNumber.toString()}
                    onChangeText={handleChange('floorNumber')}
                    onBlur={handleBlur('floorNumber')}
                    keyboardType="number-pad"
                  />
                  {touched.floorNumber && errors.floorNumber && (
                    <Text style={styles.errorText}>{errors.floorNumber}</Text>
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
                        {editingFloor ? 'Update Floor' : 'Create Floor'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
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
  floorCard: {
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
  floorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  floorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  floorDetails: { flex: 1 },
  floorNumber: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  floorMeta: { fontSize: 14, color: '#666' },
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
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  form: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
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
  },
  submitButtonDisabled: { backgroundColor: '#A0A0A0', opacity: 0.6 },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
