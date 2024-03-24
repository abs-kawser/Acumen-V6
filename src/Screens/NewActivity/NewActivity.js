import {
  Button,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import {AuthContext} from '../../Context/AuthContext';

import moment from 'moment';
import 'moment-timezone';
import base64 from 'base-64';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import customStyle from '../../Styles/commonStyle';
import {SelectList} from 'react-native-dropdown-select-list';
import {Base_Url, PASSWORD, USERNAME} from '../../../variable';

import {Dropdown} from 'react-native-element-dropdown';
import {CustomerContext} from '../../Context/CustomerProvider';
import {
  getActivityData,
  initDatabase,
  insertNewActivity,
} from '../../Database/NewActivityTable';
import {useToast} from 'react-native-toast-notifications';
import {
  initTimeTrackerDatabase,
  insertTimeTrackerItems,
} from '../../Database/TimeTrackerTable';
import {initDraftDatabase, insertDraftItems} from '../../Database/DraftTable';
import { useTranslation } from 'react-i18next';


const NewActivity = () => {
  const { t, i18n } = useTranslation();

  const navigation = useNavigation();
  const date = moment();
  const toast = useToast();

  const isFocused = useIsFocused();

  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  const {login, userDetails} = isLoggedIn;



  // const {
  //   selectedCustomerType,
  //   setSelectedCustomerType,
  //   selectedCustomer,
  //   setSelectedCustomer,
  //   showInput,
  //   setShowInput,
  //   showCustomerFields,
  //   setShowCustomerFields,
  //   note,
  //   setNote,
  // } = useContext(CustomerContext);


  const [selectedCustomerType, setSelectedCustomerType] = useState('Default');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // console.log("selected customer type ///////",selectedCustomerType)
  const [createNewCustomer, setCreateNewCustomer] = useState(null);

  console.log(
    'created newly customer data ====>>>>>',
    JSON.stringify(createNewCustomer?.name, null, 2),
  );

  const [showInput, setShowInput] = useState(false);
  const [showCustomerFields, setShowCustomerFields] = useState(false);

  const [note, setNote] = useState('');

  console.log('this is selected customer type', selectedCustomerType);
  // console.log('user details', JSON.stringify(userDetails, null, 2));

  // ======= date========\\
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const [fromTime, setFromTime] = useState(new Date()); // State for selected time
  const [showTimePicker, setShowTimePicker] = useState(false); // State for time picker visibility


  // ===================
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
// const [status, setStatus] = useState(null); 



  // Initialize status state as null
  const [data, setData] = React.useState([]);

  // today
  const [value, setValue] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const [isClicked, setClicked] = useState(false);

  // =================================

  // const [activityId, setActivityId] = useState(null);
  // const [activityBy, setActivityBy] = useState(null);
  // const [deviceActivityId, setDeviceActivityId] = useState('');
  // const localDateTime = date.format('M/D/YYYY hh:mm:ss');

  // const activityDate = startDate.format('M/D/YYYY')

  // useEffect(() => {

  //   // Update the time every second
  //   const interval = setInterval(() => {
  //     const updatedTime = moment().format('M/D/YYYY hh:mm:ss');
  //     setDeviceTime(updatedTime);
  //   }, 1000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);



  const handleNewActivity = () => {
    // const value = [
    //   {
    //     ActivityID: 1,
    //     ActivityBy: userDetails?.empId,
    //     DeviceActivityID: deviceActivityId,
    //     DeviceSystemDateTime: localDateTime,
    //     CustomerId:
    //       selectedCustomerType === 'Default'
    //         ? selectedCustomerType
    //         : selectedCustomer.value,
    //     ActivityType: checked,
    //     Notes: notes,
    //     ActivityStartTime: `${formatDate(startDate)} ${moment(fromTime).format(
    //       'h:mm:ss',
    //     )}`,
    //     ActivityEndTime: localDateTime,
    //     AppointmentNo: '',
    //     TransferEmployeeId: '',
    //     EntryBy: userDetails?.empId,
    //     EntryDate: localDateTime,
    //   },
    // ];

    const value = {
      CustomerId:
        selectedCustomerType === 'Default'
          ? selectedCustomerType
          : selectedCustomer.value,

      ActivityStartTime: `${formatDate(startDate)} ${moment(fromTime).format(
        'h:mm:ss',
      )}`,
    };
    navigation.navigate('All Activity', {data: value});
  };

  useFocusEffect(
    React.useCallback(() => {
      setShowInput(false); 
      // Set the state variable `showInput` to false
      // Set the state variable `selectedCustomerType` to 'Default'
      setSelectedCustomerType('Default'); 
    }, []),
  );

  // const handleRadioPress = value => {
  //   setChecked(value);
  //   if (value === '1') {
  //     setStatus('Approved');
  //   } else if (value === '2') {
  //     setStatus('Rejected');
  //     navigation.navigate('Order Delivery');
  //   } else if (value === '3') {
  //     setStatus('Rejected');
  //     navigation.navigate('Appointment Screen');
  //   }
  // };

  const currentDate = moment().format('DD/MM/YYYY');

  
  // ============== date time formate===================
  const formatDate = date => {
    return moment(date).format('DD/MM/YYYY');
  };

  const formatTime = time => {
    return moment(time).format('h:mm A');
  };

  // handle start date change

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // setStartDate(moment(selectedDate).format('DD/MM/YYYY'));
      // if (selectedDate > endDate) {
      //   setError('select correct date');
      // } else {
      //   setError('');
      // }
    }
  };

  const handleFromTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setFromTime(selectedTime);
      // if (selectedTime > toTime) {
      //   setTimeError('select correct time');
      // } else {
      //   setTimeError('');
      // }
    }
  };

  // ====== my code ======

  // const handleValueChange = value => {
  //   console.log('value', value);

  //   if (value === '1') {
  //     setShowInput(true);
  //     setShowCustomerFields(true);
  //   } else if (value === '2') {
  //     setShowInput(true);
  //     setShowCustomerFields(false);
  //   } else {
  //     setShowInput(false);
  //     setShowCustomerFields(false);
  //   }
  // };

  //======= kawser code ======

  const handleValueChange = value => {
    if (value === '1') {
      setShowInput(true);
      setShowCustomerFields(true);
      // Clear customer information fields
      setCustomerName('');
      setCustomerEmail('');
      setCustomerMobile('');
      setCustomerAddress('');

      setSelectedCustomer(null);
    } else if (value === '2') {
      setShowInput(true);
      setShowCustomerFields(false);

      setCustomerName('');
      setCustomerEmail('');
      setCustomerMobile('');
      setCustomerAddress('');

      setSelectedCustomer(null);
    } else {
      setShowInput(false);
      setShowCustomerFields(false);

      setSelectedCustomer(null);
    }
  };

  //========== customer list api ===========

  const handleCustomerList = async result => {
    try {
      const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);
      const response = await fetch(
        `${Base_Url}/api/Master/CheckCustomerApi?customerNameOrNumber=${searchText}`,
        {
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: authHeader,
          },
        },
      );
      const jsonData = await response.json();
      const transformedData = jsonData.map(entry => ({
        label: entry.customerName,
        value: entry.customerId,
        number: entry.contactNumberOne,
        email: entry.email,
        address: entry.customerAddress,
      }));

      // console.log('transformed data', JSON.stringify(transformedData, null, 2));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setIsLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    handleCustomerList();
  }, [searchText]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //    if (selectedCustomerType === 1) {
  //     setCustomerMobile(""),
  //     setCustomerEmail('')
  //    }

  //   }, [])
  // );

  //========= create new customer api calling =========

  //==== my code =====

  // const handleCreateNewCustomer = async () => {
  //   try {
  //     const requestData = {
  //       Name: customerName,
  //       PhoneNo: customerMobile,
  //       Email: customerEmail,
  //       Address: customerAddress,
  //       EntryBy: userDetails?.empId.toString(),
  //     };

  //     console.log(
  //       'Posting new customer data:',
  //       JSON.stringify(requestData, null, 2),
  //     );

  //     const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);

  //     const response = await fetch(`${Base_Url}/api/Master/CreateCustomerApi`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: authHeader,
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const result = await response.json();
  //     console.log('API Response:', JSON.stringify(result, null, 2));

  //     // setOutput(result);

  //     ToastAndroid.show(result.status, ToastAndroid.SHORT);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
  //   }
  // };

  // ====== kawser code ======



  const handleCreateNewCustomer = async () => {
    // Check if any required fields are empty
    if (
      !customerName ||
      !customerMobile ||
      !customerEmail ||
      !customerAddress
    ) {
      // If any required field is empty, show an alert message
      Alert.alert('Please fill out all fields');
      return; // Stop further execution
    }

    try {
      const requestData = {
        Name: customerName,
        PhoneNo: customerMobile,
        Email: customerEmail,
        Address: customerAddress,
        EntryBy: userDetails?.empId.toString(),
      };

      console.log(
        'Posting new customer data:',
        JSON.stringify(requestData, null, 2),
      );

      const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);

      const response = await fetch(`${Base_Url}/api/Master/CreateCustomerApi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      setCreateNewCustomer(result);

      console.log(
        'create new customer Response =========== :',
        JSON.stringify(result, null, 2),
      );

      // setOutput(result);
      ToastAndroid.show(result.status, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
    }
  };

  //  ======================= TODAYS WORKS FOR NEW ACTIVITY TABLE =======================


  const [activityData, setActivityData] = useState(null);
  const [ActivityStartTime, setActivityStartTime] = useState(null);
  const [deviceActivityId, setDeviceActivityId] = useState('');
  const [timeTracker, setTimeTracker] = useState(null);

  const date2 = moment();
  const time = date2.format('YYYY-MM-DDTHH:mm:ss');

  const currentDate2 = date.format('YYYY-MM-DDTHH:mm:ss');

  console.log(
    'specific time track data from new activity page ==== >',
    JSON.stringify(timeTracker, null, 2),
  );

  const utcDateTime = moment.utc();
  const bdDateTime = utcDateTime.tz('Asia/Dhaka').format('YYYY-MM-DDTHH:mm:ss');

  // generate device activity number
  useEffect(() => {
    // Function to generate a 10-digit random number
    const generateRandomNumber = () => {
      const id = userDetails.empId;
      const randomPart = Math.floor(Math.random() * 1000000000); // Generate a random 9-digit number
      const fullNumber = `${id}${randomPart.toString().padStart(9, '0')}`;
      setDeviceActivityId(fullNumber);
    };
    // Call the function to generate the random number when the component mounts
    generateRandomNumber();
  }, []);

  // call start time
  useEffect(() => {
    setActivityStartTime(bdDateTime);
  }, []);

  // initialize database
  useEffect(() => {
    //=== activity ====
    initDatabase();
    getData();
    // deleteData()

    // === draft ====
    initDraftDatabase();
    // getDraftallData();

    // ==== Time tracker =====
    initTimeTrackerDatabase();
    // getTimeTrackerAllData();
  }, []);

  // store all data by variable
  const ActivityBy = userDetails?.empId;
  const DeviceActivityID = deviceActivityId;
  const DeviceSystemDateTime = bdDateTime;
  // const CustomerId = data?.CustomerId;
  const CustomerId =
    selectedCustomerType === 'Default'
      ? selectedCustomerType
      : createNewCustomer
      ? createNewCustomer.customerId
      : selectedCustomer?.value;

  const CustomerType = selectedCustomerType;

  // const Notes = notes;
  const Notes = note;

  // const ActivityStartTime = data?.ActivityStartTime;
  // const ActivityStartTime = bdDateTime;
  // const ActivityEndTime = bdDateTime;

  // for time tracker
  // const ActivityTime = activityTime;



  const WorkingStatus = 1;
  const EntryBy = userDetails?.empId;
  const EntryDate = currentDate2; // DeviceSystemDateTime

  const CustomerName = selectedCustomer
    ? selectedCustomer.label
    : createNewCustomer
    ? createNewCustomer.name
    : '';
  const CustomerMobile = selectedCustomer
    ? selectedCustomer.number
    : createNewCustomer
    ? createNewCustomer.phoneNo
    : '';

  // console.log("device activity idddddddd =====",DeviceActivityID)

  const saveData = async () => {
    try {
      const date = moment();
      const ActivityEndTime = date.format('YYYY-MM-DDTHH:mm:ss');
      // Call insertNewActivity with the correct value
      await insertNewActivity(
        ActivityBy,
        DeviceActivityID,
        DeviceSystemDateTime,
        CustomerId,
        Notes,
        ActivityStartTime,
        ActivityEndTime,

        CustomerName,
        CustomerMobile,
        WorkingStatus,
        CustomerType,
        success => {
          if (success) {
            // Alert.alert('Data inserted successfully');
            toast.show('Data inserted successfully', {
              type: 'success',
              duration: 2000,
            });

            navigation.navigate('All Activity', {
              deviceId: deviceActivityId,
            });

            saveTimeTrackerData(time);
            saveDraftData();
            // getData();
          } else {
            // Alert.alert('Failed to insert data');
            toast.show('Failed to insert data', {
              type: 'danger',
              duration: 2000,
            });
          }
        },
      );
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error appropriately
    }
  };


  // const getData = () => {
  //   getActivityData(item => setActivityData(item));
  // };

  const getData = () => {
    getActivityData(item => {
      setActivityData(item);
      console.log(
        'this is newly created activity data ==== >',
        JSON.stringify(item, null, 2),
      );
    });
  };

  //=============== time tracker ===============
  // time tracker date time update
  // useEffect(() => {
  //   saveTimeTrackerData(time);
  // }, [isFocused]);

  const saveTimeTrackerData = ActivityTime => {
    insertTimeTrackerItems(
      DeviceActivityID,
      ActivityTime,
      WorkingStatus,
      EntryBy,
      EntryDate, // DeviceSystemDateTime
      success => {
        if (success) {
          // toast.show('Pause data inserted successfully', {
          //   type: 'success',
          //   duration: 1500,
          // });

          getTimeTrackerAllData();
          // navigation.navigate('Draft');
        } else {
          // Alert.alert('Failed to insert Time Tracker data');
          toast.show('Failed to insert pause data', {
            type: 'success',
            duration: 2000,
          });
        }
      },
    );
  };

  const saveDraftData =  () => {
    const date = moment();
    const ActivityEndTime = date.format('YYYY-MM-DDTHH:mm:ss');

     insertDraftItems(
      ActivityBy,
      DeviceActivityID,
      DeviceSystemDateTime,
      CustomerId,
      Notes,
      ActivityStartTime,
      ActivityEndTime,

      CustomerName,
      CustomerMobile,
      CustomerType,
      WorkingStatus,
      success => {
        if (success) {

          // toast.show('Draft data inserted successfully', {
          //   type: 'success',
          //   duration: 2000,
          // });

          console.log('Draft data inserted successfully')
          getDraftallData();
          // navigation.navigate('HomeScreen');
          // Call saveTimeTrackerData after saveDraftData
          // saveTimeTrackerData(time);
        } else {
          Alert.alert('Failed to insert draft data');
          toast.show('Failed to insert draft data', {
            type: 'danger',
            duration: 2000,
          });
        }
      },
    );
  };

  const getTimeTrackerAllData = () => {
    // getTimeTrackerData(item => setTimeTracker(item));
    getTimeTrackerItemsByDeviceActivityId(deviceActivityId, item => {
      setTimeTracker(item);
    });
  };



  return (

    <ScrollView style={customStyle.container}>
      <View style={styles.mainContainer}>
        {/* top header text */}
        <View style={{alignSelf: 'center', marginBottom: 55}}>
          <Text style={{color: '#000000', fontSize: 20, fontWeight: '700'}}>
            Activity No: {DeviceActivityID}
          </Text>
        </View>

        {/* Date section */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingHorizontal: 15,
          }}>
          <View style={{flex: 1}}>

            <Text style={styles.label}>
             {t('navigation.Activity Date')}         
              </Text>
                 {/* Example of translating text */}
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              style={styles.DayButtonContainer}>
              <Icon
                name="calendar-alt"
                size={20}
                // color="white"
                style={styles.icon}
              />
              <Text style={styles.dateText}>
                {/* {moment(startDate).format('DD/MM/YYYY')} */}
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>

            {/* Date picker */}
            {showStartDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleStartDateChange}
              />
            )}
          </View>

          {/* time section */}
          <View>           
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.TimeButtonContainer}>
              <Icon name="clock" size={20} style={styles.icon} />
              <Text style={styles.dateText}>{formatTime(fromTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={fromTime}
                display="spinner" // Set display to "spinner" for seconds
                mode="time" // Set mode to "time" for time picker
                onChange={handleFromTimeChange}
              />
            )}
          </View>
        </View>

        {/* customer type ----*/}
        <View>
          <Text style={styles.label}>Customer Type</Text>
          <View style={styles.dropdownPicker}>
            <Picker
              selectedValue={selectedCustomerType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCustomerType(itemValue);
                handleValueChange(itemValue);
                // clear filed when select 'New'
                if (itemValue === '1') {
                  // setSelectedCustomer('');
                  // setSearchText('');
                  // setValue(null);
                  setCustomerMobile(''), 
                  setCustomerEmail('');
                }
              }}
              style={{color: 'gray'}}
              dropdownIconColor="gray">
              <Picker.Item label="Default" value="Default" />
              <Picker.Item label="New" value="1" />
              <Picker.Item label="Existing" value="2" />
            </Picker>
          </View>
        </View>

        {/* ====================================== */}
        {showInput && (
          <>
            {selectedCustomerType === '2' && (
              <View>
                <Text style={styles.label}>Customer</Text>
                {/* customer dropdown */}
                <View>
                  <TouchableOpacity
                    style={styles.dropdownSelector}
                    // onPress={() => setClicked(!isClicked)}
                    onPress={() => {
                      setSearchText('');
                      setClicked(!isClicked);
                    }}>
                    <Text style={{color: 'gray'}}>
                      {selectedCustomer
                        ? `${selectedCustomer.label}`
                        : 'Select an item'}
                    </Text>
                    <Icon name="sort-down" size={15} color="gray" />
                  </TouchableOpacity>

                  <Modal
                    isVisible={isClicked}
                    onBackdropPress={() => setClicked(false)}>
                    <View style={styles.dropdownArea}>
                      <TextInput
                        placeholder="search"
                        style={styles.searchInput}
                        onChangeText={text => setSearchText(text)}
                        placeholderTextColor="gray"
                      />
                      <FlatList
                        // data={filteredData}
                        data={data}
                        // sortedData
                        renderItem={({item, index}) => {
                          return (
                            <TouchableOpacity
                              style={{
                                width: '85%',
                                alignSelf: 'center',
                                height: 50,
                                justifyContent: 'center',
                                borderBottomWidth: 0.5,
                                borderColor: '#8e8e8e',
                              }}
                              onPress={() => {
                                setSelectedCustomer(item);
                                setClicked(!isClicked);
                              }}>
                              <Text style={{fontWeight: '600', color: 'gray'}}>
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </Modal>
                </View>
              </View>
            )}

            {showCustomerFields && selectedCustomerType === '1' && (
              //  {/* customer name */}
              <View style={styles.leaveContent}>
                <Text style={styles.label}>Customer Name</Text>
                <View style={{flex: 1}}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.input]}
                    placeholder="Name"
                    placeholderTextColor="gray"
                    onChangeText={text => setCustomerName(text)}
                    value={customerName}
                  />
                </View>
              </View>
            )}

            {/* customer mobile */}

            <View style={styles.leaveContent}>
              <Text style={styles.label}>Customer Mobile</Text>
              <View style={{flex: 1}}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  style={[styles.input]}
                  placeholder="Mobile"
                  placeholderTextColor="gray"
                  onChangeText={text => setCustomerMobile(text)}
                  value={
                    selectedCustomer ? selectedCustomer.number : customerMobile
                  }
                />
              </View>
            </View>

            {/* customer email */}
            <View style={styles.leaveContent}>
              <Text style={styles.label}>Customer Email</Text>
              <View style={{flex: 1}}>
                <TextInput
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.input,
                    {
                      backgroundColor:
                        selectedCustomerType === '2' ? '#dee2e6' : 'white',
                    },
                  ]}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  onChangeText={text => setCustomerEmail(text)}
                  value={
                    selectedCustomer ? selectedCustomer.email : customerEmail
                  }
                  editable={selectedCustomerType === '1' ? true : false}
                />
              </View>
            </View>

            {/* customer address */}
            <View style={styles.leaveContent}>
              <Text style={styles.label}>Customer Address</Text>
              <View style={{flex: 1}}>
                <TextInput
                  // multiline
                  // numberOfLines={4}
                  style={[
                    styles.input,
                    {
                      backgroundColor:
                        selectedCustomerType === '2' ? '#dee2e6' : 'white',
                    },
                  ]}
                  placeholder="Address"
                  placeholderTextColor="gray"
                  onChangeText={text => setCustomerAddress(text)}
                  value={
                    selectedCustomer
                      ? selectedCustomer.address
                      : customerAddress
                  }
                  editable={selectedCustomerType === '1' ? true : false}
                />
              </View>
            </View>

            {/* customer note */}
            {showCustomerFields && selectedCustomerType === '1' && (
              <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateNewCustomer}>
                  <Text
                    style={{color: '#FFFFFF', fontWeight: '700', fontSize: 22}}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            // alignItems: 'center',
            flexDirection: 'row',
            marginTop: 100,
            gap: 20,
          }}>
          <View
            style={{
              backgroundColor: '#F7D2D2AB',
              paddingHorizontal: 40,
              paddingVertical: 12,
              borderRadius: 50,
              borderColor: 'red',
              borderWidth: 1,
            }}>
            <TouchableOpacity
              // onPress={() => navigation.navigate('Activity Check')}
              onPress={() => navigation.goBack()}>
              <Text style={{color: 'red', fontWeight: '700'}}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: '#04C1AA30',
              paddingHorizontal: 40,
              paddingVertical: 12,
              borderRadius: 50,
              borderColor: '#04C1AA',
              borderWidth: 1,
            }}>
            <TouchableOpacity
              // onPress={() => navigation.navigate('Activity Check')}
              onPress={saveData}>
              <Text style={{color: '#04C1AA', fontWeight: '700'}}>
                Save & Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>

  );
};

export default NewActivity;

const styles = StyleSheet.create({
  DayButtonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    // padding: 10,
    height: 45,
    borderRadius: 5,
    width: 130,
    // width: "80%",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0B87AC',
    // flex:1,
  },
  TimeButtonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    // padding: 10,
    height: 45,
    borderRadius: 5,
    width: 130,
    // width: "80%",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0B87AC',
    // flex:1,
  },
  icon: {
    marginRight: 10,
    color: 'gray',
  },
  dateText: {
    color: 'black', // Change this to your desired text color
    fontSize: 16,
  },
  // label
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
    fontFamily: 'Jost-Regular',
    marginTop: 10,
    fontWeight: '700',
  },

  dropdownPicker: {
    borderWidth: 1,
    borderColor: '#0B87AC',
    borderRadius: 5,
    height: 45,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },

  mainContainer: {
    paddingHorizontal: 10,
    marginBottom: 50,
  },

  // radio button

  radioBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical: 15,
    flexWrap: 'wrap',
  },

  radioBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    // justifyContent: 'center',
    // flex:1,
    // borderWidth:1,
    // width:"50%",

    // alignSelf:"center"
  },

  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#0B87AC',
    borderRadius: 5,
    // marginTop: 20,
    paddingHorizontal: 15,
    color: 'gray',

    paddingLeft: 10,
    // flex: 1,
  },

  // ================

  dropdownSelector: {
    width: '100%',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#0B87AC',
    display: 'flex',
    flexDirection: 'row',
    // alignItems:"center",
    justifyContent: 'space-between',
  },

  dropdownArea: {
    width: '90%',
    height: '50%',
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
    zIndex: 200,
  },
  searchInput: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    borderWidth: 0.2,
    borderColor: '#8e8e8e',
    borderRadius: 7,
    marginTop: 20,
    paddingLeft: 20,
    color: 'gray',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    gap: 5,
  },

  button: {
    // borderWidth:1,
    width: '100%',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: '#2FD790',
    elevation: 5,
    // flex:1,
  },
});



{
  /* <Dropdown
                  mode="default"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={{color: 'red'}}
                  data={data}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Customer"
                  searchPlaceholder="Search..."
                  value={selectedCustomer}
                  onChangeText={text => {
                    setSearchText(text);
                    console.log('Search Text:', text);
                  }}
                  onChange={item => {
                    console.log('itemmmmm', item);
                    setSelectedCustomer(item.value);

                    // setSearchText(item.number);

                    // setSearchText(item);

                    setValue(item);

                    setCustomerMobile(item?.number);
                    setCustomerEmail(item.email);
                    setCustomerAddress(item.address);
                  }}
                /> */
}

{
  /* <View>
          <Text style={styles.label}>Activity</Text>

          <View style={styles.radioBtn}>
            <View style={styles.radioBtnContainer}>
              <RadioButton
                value="1"
                color="green"
                status={checked === '1' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioPress('1')} // Call handleRadioPress with the value 'first'
              />
              <Text style={{color: 'black'}}>New Activity</Text>
            </View>

            <View style={styles.radioBtnContainer}>
              <RadioButton
                value="2"
                color="tomato"
                status={checked === '2' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioPress('2')} // Call handleRadioPress with the value 'second'
              />
              <Text style={{color: 'black'}}>For Delivery</Text>
            </View>

            <View style={styles.radioBtnContainer}>
              <RadioButton
                value="3"
                color="blue"
                status={checked === '3' ? 'checked' : 'unchecked'}
                onPress={() => handleRadioPress('3')} // Call handleRadioPress with the value 'second'
              />
              <Text style={{color: 'black'}}>Appoinment</Text>
            </View>
          </View>
        </View> */
}

{
  /* Notes */
}

{
  /* <View style={styles.leaveContent}>
          <Text style={styles.label}>Notes</Text>
          <View style={{flex: 1}}>
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.input]}
              placeholder="Write notes here"
              placeholderTextColor="gray"
              onChangeText={text => setNotes(text)}
              value={notes}
            />
          </View>
        </View> */
}

{
  /* button */
}

{
  /* <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <TouchableOpacity
            // onPress={() => navigation.navigate('Activity Check')}
            onPress={handleNewActivity}>
            <Image
              style={{width: 65, height: 65, resizeMode: 'contain'}}
              source={require('../../../assets/homeScreen/next-button.png')}
            />
          </TouchableOpacity>
        </View> */
}
