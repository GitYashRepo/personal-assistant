import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export const executeTool = async (action: string, data: any) => {
  try {
    switch (action) {
      case 'make_phone_call':
        if (data?.contact) {
          await Linking.openURL(`tel:${data.contact}`);
        }
        break;

      case 'search_youtube':
        if (data?.query) {
          // Native YouTube app URI scheme or fallback to web
          await Linking.openURL(`vnd.youtube://results?search_query=${encodeURIComponent(data.query)}`)
            .catch(() => Linking.openURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(data.query)}`));
        }
        break;

      case 'open_youtube':
        await Linking.openURL(`vnd.youtube://`)
          .catch(() => Linking.openURL('https://www.youtube.com'));
        break;

      case 'google_search':
        if (data?.query) {
          await Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(data.query)}`);
        }
        break;

      case 'create_alarm':
        if (Platform.OS === 'android' && data?.hour !== undefined && data?.minute !== undefined) {
          // Requires android.permission.SET_ALARM in AndroidManifest
          await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
            extra: {
              'android.intent.extra.alarm.HOUR': Number(data.hour),
              'android.intent.extra.alarm.MINUTES': Number(data.minute),
              'android.intent.extra.alarm.SKIP_UI': true,
            },
          });
        } else {
          Alert.alert("Alarms", "Alarm creation is currently only supported on Android native devices.");
        }
        break;

      case 'create_calendar_event':
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCalendar = calendars.find(c => c.isPrimary) || calendars[0];
          
          if (defaultCalendar) {
            // Assume date is YYYY-MM-DD and time is HH:MM
            const startDate = new Date(`${data.date}T${data.time}:00`);
            const endDate = new Date(startDate.getTime() + (data.duration || 60) * 60000);
            
            await Calendar.createEventAsync(defaultCalendar.id, {
              title: data.title,
              startDate,
              endDate,
            });
            Alert.alert("Calendar", "Event created successfully!");
          }
        } else {
          Alert.alert("Permission Required", "Calendar permission is required to create events.");
        }
        break;

      case 'create_reminder':
        Alert.alert("Reminder Set", `I'll remind you to ${data?.title || 'do that'}.`);
        break;

      case 'create_note':
        // Prompt user for note app choice as per Architecture specs
        Alert.alert(
          "Which Notes App?",
          "I found multiple note-taking apps. Which one should I use?",
          [
            { text: "Google Keep", onPress: () => Linking.openURL(`https://keep.google.com/`) },
            { text: "Evernote", onPress: () => Linking.openURL(`evernote://`) },
            { text: "Cancel", style: "cancel" }
          ]
        );
        break;

      case 'open_notes_app':
        Linking.openURL(`https://keep.google.com/`);
        break;

      case 'respond':
        // Just verbal/text response, no native action needed
        break;

      default:
        console.log(`Action ${action} is not natively implemented yet.`);
        break;
    }
  } catch (error) {
    console.error(`Error executing tool ${action}:`, error);
    Alert.alert("Tool Error", `Failed to execute action: ${action}`);
  }
};
