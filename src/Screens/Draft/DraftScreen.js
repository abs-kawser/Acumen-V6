import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {deleteDraftData, getDraftData, getDraftDataByActivityBy} from '../../Database/DraftTable';
import moment from 'moment';
import { AuthContext } from '../../Context/AuthContext';

const DraftScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  const {login, userDetails} = isLoggedIn;

  const [draftData, setDraftData] = useState(null);

  console.log('draft from draft screen', JSON.stringify(draftData, null, 2));

  useEffect(() => {
    getDraftallData();
  }, [isFocused]);


  const ActivityBy = userDetails?.empId;

  const getDraftallData = () => {
    // getDraftData(item => setDraftData(item));


    getDraftDataByActivityBy(ActivityBy, item => {
      setDraftData(item);
    });


  };

  //   delete data  getDraftDataByActivityBy

  const handleDeleteItem = id => {
    deleteDraftData(id, success => {
      if (success) {
        // Refresh data after deletion
        getDraftallData();
        // Show success message
        Alert.alert('Success', 'Item deleted successfully');
      } else {
        // Show error message if deletion fails
        Alert.alert('Error', 'Failed to delete item');
      }
    });
  };

  return (
    <ScrollView style={{flex: 1, padding: 10}}>
      <View style={{marginBottom: 50}}>
        {draftData?.map((item, index) => (
          <View style={styles.contents} key={index}>
            <View style={styles.leaveDetails}>
              {/* <View style={styles.leaveContent}>
              <Text style={styles.contentTxt}>Draft ID</Text>
              <Text style={styles.contentTxt2}>{item.Draft_id}</Text>
            </View> */}

              <View style={styles.leaveContent}>
                <Text style={styles.contentTxt}>ActivityID</Text>
                <Text style={styles.contentTxt2}>{item.DeviceActivityId}</Text>
              </View>

              <View style={styles.leaveContent}>
                <Text style={styles.contentTxt}>Customer</Text>
                <Text style={styles.contentTxt2}>
                  {item?.CustomerType === 'Default'
                    ? 'Default'
                    : item?.CustomerName}
                </Text>
              </View>

              {/* <View style={styles.leaveContent}>
              <Text style={styles.contentTxt}>EntryBy</Text>
              <Text style={styles.contentTxt2}>{item.ActivityBy}</Text>
            </View> */}

              <View style={styles.leaveContent}>
                <Text style={styles.contentTxt}>Start Time</Text>
                <Text style={styles.contentTxt2}>
                  {moment(item.ActivityStartTime).format(
                    'DD MMM YYYY, hh:mm A',
                  )}
                </Text>
              </View>

              <View style={styles.leaveContent}>
                <Text style={styles.contentTxt}>Status</Text>
                <Text
                  style={[
                    styles.contentTxt2,
                    {
                      color: item.WorkingStatus === 4 ? 'blue' : 'tomato',
                      fontSize: 16,
                      fontWeight: '800',
                    },
                  ]}>
                  {item.WorkingStatus === 1 ? 'Pause' : 'Submitted'}
                </Text>
              </View>
            </View>

            {/* button */}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => handleDeleteItem(item.Draft_id)}>
                <Icon name="trash" color={'#e63946'} size={15} />
                {/* <Text style={styles.buttonText2}>arif</Text> */}
                <Text style={{fontWeight: 'bold', color: '#000000'}}>
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      item.WorkingStatus === 4 ? '#4c956c' : '#38a3a5',
                  },
                ]}
                disabled={item.WorkingStatus === 4}
                // onPress={() =>
                //   navigation.navigate('All Activity', {value: item})
                // }

                onPress={() =>
                  navigation.navigate('All Activity', {
                    value: item,
                    WorkingStatus: 2, // Add a parameter to indicate resume action
                    ActivityID: item.DeviceActivityId,
                  })
                }>
                <Icon
                  name={item.WorkingStatus === 4 ? 'check' : 'user-edit'}
                  color={'#ffffff'}
                  size={15}
                />
                <Text style={{fontWeight: 'bold', color: '#ffffff'}}>
                  {item.WorkingStatus === 4 ? 'Submitted' : 'Resume'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DraftScreen;

const styles = StyleSheet.create({
  contents: {
    backgroundColor: 'white',
    borderRadius: 10,
    backgroundColor: 'rgba(100,223,223,0.2)',
    marginVertical: 10,
  },
  leaveContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: 0,
  },

  leaveDetails: {
    padding: 10,
  },
  contentTxt: {
    color: '#1d2d44',
    flex: 1,
    fontWeight: '700',
    lineHeight: 25,
    // textAlign:"justify"
  },

  contentTxt2: {
    color: '#1d2d44',
    flex: 1,
    fontWeight: '500',
    lineHeight: 25,
    // textAlign:"justify"
  },

  buttonContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop:100,
    // height:"50%",
  },
  button: {
    width: '50%', // Set width to 50% of screen width
    // backgroundColor: 'rgba(16,69,29,0.2)',
    backgroundColor: '#10451d',
    padding: 5,
    borderBottomRightRadius: 10,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  button2: {
    width: '50%', // Set width to 50% of screen width
    backgroundColor: '#ffc8dd',
    padding: 10,
    borderBottomLeftRadius: 10,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
});
