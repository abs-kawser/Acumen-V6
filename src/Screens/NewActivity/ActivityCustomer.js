import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import customStyle from '../../Styles/commonStyle';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Base_Url, PASSWORD, USERNAME} from '../../../variable';
import base64 from 'base-64';
import moment from 'moment';
import {CustomerContext} from '../../Context/CustomerProvider';
import {
  getNewActivityByDeviceActivityId,
  updateActivityCustomer,
} from '../../Database/NewActivityTable';
import {useToast} from 'react-native-toast-notifications';
import {updateActivityDraft} from '../../Database/DraftTable';
import {AuthContext} from '../../Context/AuthContext';

const ActivityCustomer = ({route}) => {
  const navigation = useNavigation();

  const {devID} = route.params;

  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  const {login, userDetails} = isLoggedIn;
  // const { value } = route.params

  // console.log("customer value =======",value)

  const toast = useToast();
  const isFocused = useIsFocused();

  // const parsedDate =   moment(activityData[0]?.ActivityStartTime).format('YYYY-MM-DD')

  // const {
  //   selectedCustomerType,
  //   setSelectedCustomerType,
  //   selectedCustomer,
  //   setSelectedCustomer,
  //   showInput,
  //   setShowInput,
  //   showCustomerFields,
  //   setShowCustomerFields,
  // } = useContext(CustomerContext);

  // const [selectedCustomerType, setSelectedCustomerType] = useState("2");

  const [selectedCustomerType, setSelectedCustomerType] = useState('Default');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [createNewCustomer, setCreateNewCustomer] = useState(null);

  console.log(
    'created newly customer data ====>>>>>',
    JSON.stringify(createNewCustomer?.name, null, 2),
  );

  const [showInput, setShowInput] = useState(false);
  const [showCustomerFields, setShowCustomerFields] = useState(false);

  // ====================

  const [activityData, setActivityData] = useState([]);

  console.log(
    'Updatedd activity data from CUSTOMER SCREEN &&&&&&&&&&&=====>>>>',
    JSON.stringify(activityData, null, 2),
  );

  const [customerName, setCustomerName] = useState();
  const [customerEmail, setCustomerEmail] = useState();
  const [customerMobile, setCustomerMobile] = useState();
  const [customerAddress, setCustomerAddress] = useState();

  // =====================

  // const [selectedCustomerType, setSelectedCustomerType] = useState('Default');
  // console.log(
  //   'selected customer type',
  //   JSON.stringify(selectedCustomerType, null, 2),
  // );

  // const [selectedCustomer, setSelectedCustomer] = useState('');
  console.log('selected cusotmer', JSON.stringify(selectedCustomer, null, 2));

  // const CustomerId =
  //   selectedCustomerType === 'Default'
  //     ? selectedCustomerType
  //     : selectedCustomer?.value;

  const CustomerId =
    selectedCustomerType === 'Default'
      ? selectedCustomerType
      : createNewCustomer
      ? createNewCustomer.customerId
      : selectedCustomer?.value;

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

  const CustomerType = selectedCustomerType;

  // const CustomerName = selectedCustomer ? selectedCustomer.label : '';
  // const CustomerMobile = selectedCustomer ? selectedCustomer.number : '';

  // const [showInput, setShowInput] = useState(false);
  // const [showCustomerFields, setShowCustomerFields] = useState(false);

  const [searchText, setSearchText] = useState(null);

  const [isClicked, setClicked] = useState(false);
  const [data, setData] = React.useState([]);

  // useEffect(() => {
  //   // Trigger the logic to show input box based on initial selectedCustomerType
  //   handleValueChange(selectedCustomerType);
  // }, []);

  // const handleValueChange = value => {
  //   console.log('value', value);

  //   if (value === '1') {
  //     setShowInput(true);
  //     setShowCustomerFields(true); // Additional state to determine which customer fields to show
  //   } else if (value === '2') {
  //     setShowInput(true);
  //     setShowCustomerFields(false);
  //   } else {
  //     setShowInput(false);
  //     setShowCustomerFields(false);
  //   }
  // };

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

  // customer list api
  const handleCustomerList = async result => {
    try {
      const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);
      const response = await fetch(
        `${Base_Url}/api/Master/CheckCustomerApi?customerNameOrNumber=${searchText}`,
        // `${Base_Url}/api/Master/CheckCustomerApi?customerNameOrNumber=01713376375`,
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

  // ====== my code ======
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
  //     setCreateNewCustomer(result);
  //     console.log('API Response:', JSON.stringify(result, null, 2));

  //     // setOutput(result);

  //     ToastAndroid.show(result.status, ToastAndroid.SHORT);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
  //   }
  // };

  // ===============================================

  // const draftCustomer_id = value?.CustomerId ;

  // console.log(
  //   'Updateddddddddd customer data from Customer SCREEN',
  //   JSON.stringify(activityData, null, 2),
  // );

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

  useEffect(() => {
    getData();
  }, [isFocused]);

  // const updateCustomerForActivity = () => {

  //   updateActivityCustomer(
  //     devID,
  //     CustomerName,
  //     CustomerMobile,
  //     CustomerId,
  //     success => {
  //       if (success) {
  //         toast.show('Customer updated successfully', {
  //           type: 'success',
  //           duration: 2000,
  //         });

  //         // Call updateActivityDraft on success
  //         updateActivityDraft(
  //           devID,
  //           CustomerName,
  //           CustomerMobile,
  //           CustomerId,
  //           success => {
  //             if (success) {
  //               // updateActivityDraft succeeded
  //               // console.log('Draft updated successfully');
  //               toast.show('Draft updated successfully', {
  //                 type: 'success',
  //                 duration: 2000,
  //               });
  //               // Additional actions if needed
  //             } else {
  //               // updateActivityDraft failed
  //               // console.log('Failed to update draft');
  //               toast.show('Failed to update draft', {
  //                 type: 'success',
  //                 duration: 2000,
  //               });
  //               // Handle failure case for updateActivityDraft
  //             }

  //             // navigation.goBack();
  //             // getData();
  //           },
  //         );

  //         navigation.goBack();

  //         getData();

  //         // Perform any additional actions if needed
  //       } else {
  //         toast.show('Failed to update customer', {
  //           type: 'danger',
  //           duration: 2000,
  //         });
  //         // Handle the failure case
  //       }
  //     },
  //   );
  // };

  const updateCustomerForActivity = () => {
    updateActivityCustomer(
      devID,
      CustomerName,
      CustomerMobile,
      CustomerId,
      CustomerType,
      success => {
        if (success) {
          toast.show('Customer updated successfully', {
            type: 'success',
            duration: 2000,
          });

          // Call updateActivityDraft on success
          updateActivityDraft(
            devID,
            CustomerName,
            CustomerMobile,
            CustomerId,
            CustomerType,
            draftUpdateSuccess => {
              // Callback for updateActivityDraft
              if (draftUpdateSuccess) {
                // updateActivityDraft succeeded
                // console.log('Draft updated successfully');
                // toast.show('Draft updated successfully', {
                //   type: 'success',
                //   duration: 2000,
                // });
                // navigation.goBack();
              } else {
                // updateActivityDraft failed
                // console.log('Failed to update draft');
                toast.show('Failed to update draft', {
                  type: 'success',
                  duration: 2000,
                });
                // Handle failure case for updateActivityDraft
              }

              // navigation.goBack();

              getData();
            },
          );

          navigation.goBack();
          // getData();

          // Perform any additional actions if needed
        } else {
          toast.show('Failed to update customer', {
            type: 'danger',
            duration: 2000,
          });
          // Handle the failure case
        }
      },
    );
  };

  const getData = () => {
    // getNewActivityByDeviceActivityId(devID, item => {
    //   setActivityData(item);
    // });

    getNewActivityByDeviceActivityId(devID, item => {
      if (item && item.length > 0) {
        setActivityData(item);
      }
    });
  };

  return (
    <View style={customStyle.container}>
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* Activity no */}
          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <Text style={{color: '#000000', fontSize: 20}}>
              {/* Activity No: {deviceActivityId} */}
              Activity No: {devID}
            </Text>
          </View>
          {/* date time */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View>
              <Text style={{fontWeight: '800', color: 'black'}}>
                <Text>Date: </Text>
                {moment(activityData[0]?.ActivityStartTime).format(
                  'DD MMM YYYY',
                )}
              </Text>
            </View>
            <View>
              <Text style={{fontWeight: '800', color: 'black'}}>
                <Text>Time:</Text>{' '}
                {moment(activityData[0]?.ActivityStartTime).format('hh:mm A')}
              </Text>
            </View>
          </View>

          {/* header */}
          <View style={{alignSelf: 'center', paddingVertical: 20}}>
            <Text style={{fontWeight: '700', fontSize: 20, color: '#000000'}}>
              Customer Info
            </Text>
          </View>

          {/* customer type */}

          <View>
            <Text style={styles.label}>Customer Type</Text>

            <View style={styles.dropdownPicker}>
              <Picker
                selectedValue={selectedCustomerType}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedCustomerType(itemValue);
                  handleValueChange(itemValue);

                  // clear filed when select 'New'  customer_id
                  if (itemValue === '1') {
                    // setSelectedCustomer('');
                    // setSearchText('');
                    // setValue(null);
                    setCustomerMobile(''), setCustomerEmail('');
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

          {showInput && (
            <>
              {selectedCustomerType === '2' && (
                <View>
                  <Text style={styles.label}>Customer</Text>

                  {/* <Dropdown
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
                /> */}

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
                                <Text
                                  style={{fontWeight: '600', color: 'gray'}}>
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
                      selectedCustomer
                        ? selectedCustomer.number
                        : customerMobile
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
                      style={{
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: 22,
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* button */}

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          flexDirection: 'row',
          // marginVertical: 100,
          marginTop: 10,
          marginBottom: 30,
          gap: 20,

       
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#F7D2D2AB',
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 50,
            borderColor: 'red',
            borderWidth: 1,
          }}
          // onPress={() => navigation.navigate('Activity Check')}
          onPress={() => navigation.goBack()}>
          <Text style={{color: 'red', fontWeight: '700'}}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#04C1AA30',
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 50,
            borderColor: '#04C1AA',
            borderWidth: 1,
          }}
          // onPress={() => navigation.navigate('Activity Check')}
          // onPress={updateCustomerForActivity}

          onPress={() => updateCustomerForActivity()}>
          <Text style={{color: '#04C1AA', fontWeight: '700'}}>Save & Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityCustomer;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 10,
    marginBottom: 50,
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
