import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoScreen({ route, navigation }) {
    const { type } = route.params;
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleNicknameUpdate = () => {
        // Firebase logic here
        Alert.alert('Updated', 'Nickname has been updated (TODO: Firebase)');
    };

    const handlePasswordChange = () => {
        // Firebase logic here
        Alert.alert('Updated', 'Password has been updated (TODO: Firebase)');
    };

    const handleLogout = () => {
        // Firebase signOut() logic here
        Alert.alert('Logged Out', 'You have been logged out (TODO: Firebase)');
    };

    const handleDelete = () => {
        // Firebase delete user logic here
        Alert.alert('Account Deleted', 'Account has been deleted (TODO: Firebase)');
    };

    const renderAccount = () => (
        <View>
            <Text style={styles.label}>Edit Nickname</Text>
            <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Enter new nickname"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleNicknameUpdate}>
                <Text style={styles.saveText}>Save Nickname</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Change Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handlePasswordChange}>
                <Text style={styles.saveText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
                <Text style={styles.dangerText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerBtn} onPress={handleDelete}>
                <Text style={styles.dangerText}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );

    const getContent = () => {
        switch (type) {
            case 'account': return renderAccount();
            case 'notifications': return <Text style={styles.description}>Notification settings will be available soon.</Text>;
            case 'privacy': return <Text style={styles.description}>Your data is stored locally. Firebase cloud sync coming soon.</Text>;
            case 'help': return <Text style={styles.description}>Need help? FAQ and contact support coming soon.</Text>;
            case 'terms': return <Text style={styles.description}>Read our full terms of service in the next version update.</Text>;
            case 'about': return <Text style={styles.description}>StoolPool helps track gut health privately and easily.</Text>;
            default: return <Text style={styles.description}>No information available for this item.</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={26} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            {getContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 100,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    saveBtn: {
        backgroundColor: '#2196f3',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    saveText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dangerBtn: {
        backgroundColor: '#ffdddd',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    dangerText: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
