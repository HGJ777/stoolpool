import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [entryCount, setEntryCount] = useState(0);
    const [username, setUsername] = useState('James123');
    const [email, setEmail] = useState('james123@gmail.com');

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load user profile data
                const profileData = await AsyncStorage.getItem('user_profile');
                if (profileData) {
                    const profile = JSON.parse(profileData);
                    setUsername(profile.username || 'James123');
                    setEmail(profile.email || 'james123@gmail.com');
                }

                // Load entry count
                const data = await AsyncStorage.getItem('stool_results');
                if (data) {
                    const parsed = JSON.parse(data);
                    setEntryCount(parsed.length);
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            }
        };

        // Load data when screen focuses
        const unsubscribe = navigation.addListener('focus', loadData);
        loadData();

        return unsubscribe;
    }, [navigation]);

    const handleNavigate = (type) => {
        navigation.navigate('Info', { type });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* User Info Card */}
            <View style={styles.userCard}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                    <TouchableOpacity style={styles.editAvatarBtn}>
                        <Ionicons name="camera" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
            </View>

            {/* Menu Options */}
            <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>Settings</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('account')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="person-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Account Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('notifications')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="notifications-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('privacy')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="shield-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Privacy & Security</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('data')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="cloud-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Data & Storage</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('help')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="help-circle-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Help & Support</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('about')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="information-circle-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>About StoolPool</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('terms')}>
                    <View style={styles.menuItemLeft}>
                        <Ionicons name="document-text-outline" size={22} color="#333" />
                        <Text style={styles.menuItemText}>Terms & Privacy Policy</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#777" />
                </TouchableOpacity>
            </View>

            {/* Version Info */}
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>StoolPool Version 1.0.0</Text>
                <Text style={styles.versionSubtext}>Built with care for your health</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    userCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f0f0f0',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    menuContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    menuItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 12,
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingBottom: 50,
    },
    versionText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '500',
    },
    versionSubtext: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 4,
    },
});