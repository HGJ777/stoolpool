import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InfoScreen({ route, navigation }) {
    const { type } = route.params;
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification settings
    const [dailyReminders, setDailyReminders] = useState(true);
    const [weeklyReports, setWeeklyReports] = useState(true);
    const [healthAlerts, setHealthAlerts] = useState(true);
    const [reminderTime, setReminderTime] = useState('9:00 AM');

    // Privacy settings
    const [biometricLock, setBiometricLock] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);
    const [anonymousData, setAnonymousData] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const profileData = await AsyncStorage.getItem('user_profile');
            const notificationSettings = await AsyncStorage.getItem('notification_settings');
            const privacySettings = await AsyncStorage.getItem('privacy_settings');

            if (profileData) {
                const profile = JSON.parse(profileData);
                setNickname(profile.username || '');
                setEmail(profile.email || '');
            }

            if (notificationSettings) {
                const settings = JSON.parse(notificationSettings);
                setDailyReminders(settings.dailyReminders ?? true);
                setWeeklyReports(settings.weeklyReports ?? true);
                setHealthAlerts(settings.healthAlerts ?? true);
                setReminderTime(settings.reminderTime || '9:00 AM');
            }

            if (privacySettings) {
                const settings = JSON.parse(privacySettings);
                setBiometricLock(settings.biometricLock ?? false);
                setAutoBackup(settings.autoBackup ?? true);
                setAnonymousData(settings.anonymousData ?? false);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveProfile = async () => {
        try {
            const profileData = { username: nickname, email };
            await AsyncStorage.setItem('user_profile', JSON.stringify(profileData));
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const saveNotificationSettings = async () => {
        try {
            const settings = { dailyReminders, weeklyReports, healthAlerts, reminderTime };
            await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
            Alert.alert('Success', 'Notification settings saved!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const savePrivacySettings = async () => {
        try {
            const settings = { biometricLock, autoBackup, anonymousData };
            await AsyncStorage.setItem('privacy_settings', JSON.stringify(settings));
            Alert.alert('Success', 'Privacy settings saved!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const handlePasswordChange = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }
        Alert.alert('Success', 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Reset app state and navigate to login
                        Alert.alert('Logged Out', 'You have been logged out successfully');
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action cannot be undone. All your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Final Confirmation',
                            'Type "DELETE" to confirm account deletion',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete Forever',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            await AsyncStorage.clear();
                                            Alert.alert('Account Deleted', 'Your account has been deleted');
                                        } catch (error) {
                                            Alert.alert('Error', 'Failed to delete account');
                                        }
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const exportData = async () => {
        try {
            const data = await AsyncStorage.getItem('stool_results');
            if (data) {
                Alert.alert('Data Export', 'Your data has been prepared for export. In a full version, this would email you a CSV file.');
            } else {
                Alert.alert('No Data', 'No tracking data found to export.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const clearAllData = () => {
        Alert.alert(
            'Clear All Data',
            'This will delete all your health tracking data. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Data',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('stool_results');
                            Alert.alert('Data Cleared', 'All tracking data has been deleted');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear data');
                        }
                    }
                }
            ]
        );
    };

    const openURL = (url) => {
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Unable to open link');
        });
    };

    const renderAccount = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Information</Text>

                <Text style={styles.label}>Display Name</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="Enter your display name"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                    <Text style={styles.saveText}>Save Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Change Password</Text>

                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handlePasswordChange}>
                    <Text style={styles.saveText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Actions</Text>

                <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.dangerText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.dangerBtn, { backgroundColor: '#ff1744' }]} onPress={handleDeleteAccount}>
                    <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.dangerText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderNotifications = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daily Tracking</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Daily Reminders</Text>
                        <Text style={styles.settingDescription}>Get reminded to log your daily health data</Text>
                    </View>
                    <Switch value={dailyReminders} onValueChange={setDailyReminders} />
                </View>

                {dailyReminders && (
                    <View style={styles.timePickerRow}>
                        <Text style={styles.label}>Reminder Time</Text>
                        <TouchableOpacity style={styles.timePicker}>
                            <Text style={styles.timeText}>{reminderTime}</Text>
                            <Ionicons name="time-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health Reports</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Weekly Summary</Text>
                        <Text style={styles.settingDescription}>Receive weekly health insights and trends</Text>
                    </View>
                    <Switch value={weeklyReports} onValueChange={setWeeklyReports} />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Health Alerts</Text>
                        <Text style={styles.settingDescription}>Get notified of concerning patterns</Text>
                    </View>
                    <Switch value={healthAlerts} onValueChange={setHealthAlerts} />
                </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveNotificationSettings}>
                <Text style={styles.saveText}>Save Notification Settings</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderPrivacy = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Security</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Biometric Lock</Text>
                        <Text style={styles.settingDescription}>Use fingerprint/face ID to secure the app</Text>
                    </View>
                    <Switch value={biometricLock} onValueChange={setBiometricLock} />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Auto Backup</Text>
                        <Text style={styles.settingDescription}>Automatically backup data to secure cloud storage</Text>
                    </View>
                    <Switch value={autoBackup} onValueChange={setAutoBackup} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Controls</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Anonymous Analytics</Text>
                        <Text style={styles.settingDescription}>Help improve the app with anonymous usage data</Text>
                    </View>
                    <Switch value={anonymousData} onValueChange={setAnonymousData} />
                </View>
            </View>

            <View style={styles.infoBox}>
                <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Your Privacy Matters</Text>
                    <Text style={styles.infoText}>
                        All your health data is stored locally on your device and encrypted.
                        We never share personal information with third parties.
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={savePrivacySettings}>
                <Text style={styles.saveText}>Save Privacy Settings</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderData = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>

                <TouchableOpacity style={styles.actionBtn} onPress={exportData}>
                    <Ionicons name="download-outline" size={20} color="#2196F3" />
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Export Your Data</Text>
                        <Text style={styles.actionDescription}>Download all your health data as CSV</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="refresh-outline" size={20} color="#FF9800" />
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>Restore from Backup</Text>
                        <Text style={styles.actionDescription}>Restore previously backed up data</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Storage Information</Text>

                <View style={styles.storageInfo}>
                    <Text style={styles.storageLabel}>Local Storage Used</Text>
                    <Text style={styles.storageValue}>2.4 MB</Text>
                </View>

                <View style={styles.storageInfo}>
                    <Text style={styles.storageLabel}>Total Entries</Text>
                    <Text style={styles.storageValue}>24 records</Text>
                </View>

                <View style={styles.storageInfo}>
                    <Text style={styles.storageLabel}>Last Backup</Text>
                    <Text style={styles.storageValue}>2 days ago</Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.dangerBtn, { marginTop: 20 }]} onPress={clearAllData}>
                <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.dangerText}>Clear All Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderHelp = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How accurate is the health scoring?</Text>
                    <Text style={styles.faqAnswer}>
                        Our scoring system is based on established medical criteria like the Bristol Stool Chart.
                        However, it's designed for tracking trends, not medical diagnosis.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Is my data secure?</Text>
                    <Text style={styles.faqAnswer}>
                        Yes! All data is stored locally on your device with encryption.
                        We never transmit personal health information without your explicit consent.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Can I share data with my doctor?</Text>
                    <Text style={styles.faqAnswer}>
                        Absolutely! Use the export feature to generate a PDF report that you can share with healthcare providers.
                    </Text>
                </View>

                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>How often should I track?</Text>
                    <Text style={styles.faqAnswer}>
                        Daily tracking provides the best insights, but even weekly tracking can help identify patterns over time.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Support</Text>

                <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => openURL('mailto:support@stoolpool.com')}
                >
                    <Ionicons name="mail-outline" size={20} color="#2196F3" />
                    <Text style={styles.contactText}>support@stoolpool.com</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => openURL('https://stoolpool.com/help')}
                >
                    <Ionicons name="globe-outline" size={20} color="#2196F3" />
                    <Text style={styles.contactText}>Visit Help Center</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactBtn}>
                    <Ionicons name="chatbubble-outline" size={20} color="#2196F3" />
                    <Text style={styles.contactText}>Live Chat Support</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Ionicons name="medical" size={24} color="#FF9800" />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Medical Disclaimer</Text>
                    <Text style={styles.infoText}>
                        This app is for tracking purposes only and should not replace professional medical advice.
                        Consult your healthcare provider for any health concerns.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderAbout = () => (
        <ScrollView style={styles.content}>
            <View style={styles.aboutHeader}>
                <View style={styles.appIcon}>
                    <Ionicons name="medical" size={40} color="#fff" />
                </View>
                <Text style={styles.appName}>StoolPool</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.description}>
                    StoolPool empowers individuals to take control of their digestive health through simple,
                    private tracking. We believe that understanding your body's patterns is the first step
                    toward better health outcomes.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Features</Text>

                <View style={styles.featureItem}>
                    <Ionicons name="analytics" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>Comprehensive health scoring based on medical standards</Text>
                </View>

                <View style={styles.featureItem}>
                    <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>Complete privacy with local data storage</Text>
                </View>

                <View style={styles.featureItem}>
                    <Ionicons name="trending-up" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>Trend analysis and pattern recognition</Text>
                </View>

                <View style={styles.featureItem}>
                    <Ionicons name="document-text" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>Export reports for healthcare providers</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Development Team</Text>
                <Text style={styles.description}>
                    Built with care by a team of developers and healthcare professionals
                    passionate about making health tracking accessible to everyone.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acknowledgments</Text>
                <Text style={styles.description}>
                    Special thanks to the medical community for establishing the Bristol Stool Chart
                    and other standardized health assessment tools that make this app possible.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connect With Us</Text>

                <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => openURL('https://twitter.com/stoolpool')}
                >
                    <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                    <Text style={styles.socialText}>Follow us on Twitter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => openURL('https://instagram.com/stoolpool')}
                >
                    <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                    <Text style={styles.socialText}>Instagram @stoolpool</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => openURL('https://stoolpool.com')}
                >
                    <Ionicons name="globe" size={20} color="#666" />
                    <Text style={styles.socialText}>Visit our website</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderTerms = () => (
        <ScrollView style={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Terms of Service</Text>
                <Text style={styles.description}>
                    By using StoolPool, you agree to these terms. Please read them carefully.
                </Text>

                <Text style={styles.termsSection}>1. Acceptance of Terms</Text>
                <Text style={styles.termsText}>
                    By accessing and using this application, you accept and agree to be bound by the terms
                    and provision of this agreement.
                </Text>

                <Text style={styles.termsSection}>2. Use License</Text>
                <Text style={styles.termsText}>
                    Permission is granted to temporarily use StoolPool for personal, non-commercial health
                    tracking purposes. This license shall automatically terminate if you violate any restrictions.
                </Text>

                <Text style={styles.termsSection}>3. Medical Disclaimer</Text>
                <Text style={styles.termsText}>
                    This app provides general health information only and is not a substitute for professional
                    medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.
                </Text>

                <Text style={styles.termsSection}>4. Privacy Policy</Text>
                <Text style={styles.termsText}>
                    Your privacy is important to us. All personal health data is stored locally on your device.
                    We do not collect, store, or transmit personal health information to external servers.
                </Text>

                <Text style={styles.termsSection}>5. Data Accuracy</Text>
                <Text style={styles.termsText}>
                    While we strive for accuracy, the information in this app may contain inaccuracies or errors.
                    Users are responsible for verifying any health information with qualified professionals.
                </Text>

                <Text style={styles.termsSection}>6. Limitation of Liability</Text>
                <Text style={styles.termsText}>
                    The developers shall not be liable for any damages arising from the use or inability to use
                    this application, including but not limited to health decisions made based on app data.
                </Text>

                <Text style={styles.termsSection}>7. Updates and Changes</Text>
                <Text style={styles.termsText}>
                    We reserve the right to update these terms at any time. Continued use of the app constitutes
                    acceptance of any changes.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Policy</Text>

                <Text style={styles.termsSection}>Data Collection</Text>
                <Text style={styles.termsText}>
                    We collect only the health tracking data you voluntarily input. No data is transmitted
                    to external servers without your explicit consent.
                </Text>

                <Text style={styles.termsSection}>Data Storage</Text>
                <Text style={styles.termsText}>
                    All data is stored locally on your device using encrypted storage. You maintain full
                    control over your data at all times.
                </Text>

                <Text style={styles.termsSection}>Data Sharing</Text>
                <Text style={styles.termsText}>
                    We never share your personal health information with third parties. Any data export
                    is initiated by you and under your control.
                </Text>
            </View>

            <View style={styles.updateInfo}>
                <Text style={styles.updateText}>Last updated: January 2025</Text>
                <TouchableOpacity onPress={() => openURL('https://stoolpool.com/terms')}>
                    <Text style={styles.linkText}>View full terms online</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const getTitle = () => {
        switch (type) {
            case 'account': return 'Account Settings';
            case 'notifications': return 'Notifications';
            case 'privacy': return 'Privacy & Security';
            case 'data': return 'Data & Storage';
            case 'help': return 'Help & Support';
            case 'terms': return 'Terms & Privacy';
            case 'about': return 'About StoolPool';
            default: return 'Settings';
        }
    };

    const getContent = () => {
        switch (type) {
            case 'account': return renderAccount();
            case 'notifications': return renderNotifications();
            case 'privacy': return renderPrivacy();
            case 'data': return renderData();
            case 'help': return renderHelp();
            case 'about': return renderAbout();
            case 'terms': return renderTerms();
            default: return <Text style={styles.description}>No information available for this item.</Text>;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>{getTitle()}</Text>
            </View>
            {getContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    saveBtn: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dangerBtn: {
        backgroundColor: '#f44336',
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dangerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
    },
    timePickerRow: {
        marginTop: 16,
    },
    timePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#f0f8ff',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 12,
    },
    actionContent: {
        flex: 1,
        marginLeft: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    actionDescription: {
        fontSize: 14,
        color: '#666',
    },
    storageInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    storageLabel: {
        fontSize: 16,
        color: '#333',
    },
    storageValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    faqItem: {
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 8,
    },
    contactText: {
        fontSize: 16,
        color: '#2196F3',
        marginLeft: 12,
    },
    aboutHeader: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    appIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 16,
        color: '#666',
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
    },
    socialText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    termsSection: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 8,
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    updateInfo: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 30,
    },
    updateText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 8,
    },
    linkText: {
        fontSize: 14,
        color: '#2196F3',
        textDecorationLine: 'underline'
    }
});
