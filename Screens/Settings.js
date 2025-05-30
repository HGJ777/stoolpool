import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* 🔙 Back button */}
            <View style={styles.backTo}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 🧱 Header */}
            <View style={styles.topBar}>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* ⚙️ Settings Options */}
            <TouchableOpacity style={styles.settingItem} onPress={() => { /* TODO: Hook to display name change */ }}>
                <Text style={styles.settingText}>Edit Nickname</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => { /* TODO: Hook to update email */ }}>
                <Text style={styles.settingText}>Change Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => { /* TODO: Hook to update password */ }}>
                <Text style={styles.settingText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => { /* TODO: Hook to logout */ }}>
                <Text style={[styles.settingText, { color: 'red' }]}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={() => { /* TODO: Hook to delete account */ }}>
                <Text style={[styles.settingText, { color: 'red' }]}>Delete Account</Text>
            </TouchableOpacity>

            <View style={styles.version}>
                <Text style={{ color: 'gray' }}>App Version: 1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 100,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
    },
    backTo:{
        position: 'absolute',
        top: 50, // or tweak this based on your status bar height
        left: 20,
        zIndex: 1,
    }
});
