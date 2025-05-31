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
            const data = await AsyncStorage.getItem('stool_results');
            if (data) {
                const parsed = JSON.parse(data);
                setEntryCount(parsed.length);
            }
        };
        loadData();
    }, []);

    const handleNavigate = (type) => {
        navigation.navigate('Info', { type });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.Header}>
                <Text style={styles.Title}>
                    Profile
                </Text>
            </View>
            <View style={styles.topBar}>
                <Text style={styles.title}>{username}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            {/* Menu Options */}
            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('account')}>
                <Text style={styles.itemText}>Account</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('notifications')}>
                <Text style={styles.itemText}>Notifications</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('privacy')}>
                <Text style={styles.itemText}>Privacy</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('help')}>
                <Text style={styles.itemText}>Help or Support</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('terms')}>
                <Text style={styles.itemText}>Terms of Service</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => handleNavigate('about')}>
                <Text style={styles.itemText}>About Us</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#777" />
            </TouchableOpacity>

            {/* Version Info */}
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version: 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
    },
    settingsIcon: {
        position: 'absolute',
        right: 20,
        top: 60,
    },
    topBar: {
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    item: {
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 19,
        fontWeight: '500',
    },
    versionContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        color: 'gray',
        fontSize: 14,
    },
    Header:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    Title:{
        fontSize: 35,
        fontWeight: 'bold'
    }
});
