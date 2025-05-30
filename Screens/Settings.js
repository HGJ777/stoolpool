import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Custom top bar with back button and title */}
            <View style={styles.backTo}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.topBar}>

                <Text style={styles.title}>Settings</Text>

                {/* Empty View to balance space (for centering title) */}
                <View style={{ width: 26 }} />
            </View>

            <Text style={styles.info}>⚙️ Settings coming soon!</Text>
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
