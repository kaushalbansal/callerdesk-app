// android/app/src/main/java/com/callerdesk/SimLogsModule.kt
package com.callerdesk

import android.provider.CallLog
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SimLogsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val PAGE_SIZE = 10
    }

    override fun getName() = "SimLogsModule"

    @ReactMethod
    fun getLatestCallLogs(limit: Int, promise: Promise) {
        try {
            val sortOrder = "${CallLog.Calls.DATE} DESC"
            reactApplicationContext.contentResolver
                .query(CallLog.Calls.CONTENT_URI, null, null, null, sortOrder)
                ?.use { cursor ->
                    val arr = Arguments.createArray()
                    var count = 0
                    // cache column indices
                    val numberCol = cursor.getColumnIndex(CallLog.Calls.NUMBER)
                    val typeCol = cursor.getColumnIndex(CallLog.Calls.TYPE)
                    val dateCol = cursor.getColumnIndex(CallLog.Calls.DATE)
                    val durationCol = cursor.getColumnIndex(CallLog.Calls.DURATION)

                    while (cursor.moveToNext() && count < limit) {
                        val m = Arguments.createMap()
                        m.putString("number", if (numberCol != -1) cursor.getString(numberCol) else "")
                        m.putInt("type", if (typeCol != -1) cursor.getInt(typeCol) else 0)
                        m.putDouble("date", if (dateCol != -1) cursor.getLong(dateCol).toDouble() else 0.0)
                        m.putInt("duration", if (durationCol != -1) cursor.getInt(durationCol) else 0)
                        arr.pushMap(m)
                        count++
                    }
                    promise.resolve(arr)
                } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERR_CALL_LOG", e)
        }
    }

    @ReactMethod
    fun getAllCallLogs(promise: Promise) {
        try {
            val now = System.currentTimeMillis()
            val ninetyDaysMs = 45L * 24 * 60 * 60 * 1000
            val cutoff = now - ninetyDaysMs

            val projection = arrayOf(
                CallLog.Calls._ID,
                CallLog.Calls.NUMBER,
                CallLog.Calls.TYPE,
                CallLog.Calls.DATE,
                CallLog.Calls.DURATION,
                CallLog.Calls.CACHED_NAME
            )

            val selection = "${CallLog.Calls.DATE} >= ?"
            val selectionArgs = arrayOf(cutoff.toString())
            val sortOrder = "${CallLog.Calls.DATE} DESC"

            reactApplicationContext.contentResolver
                .query(CallLog.Calls.CONTENT_URI, projection, selection, selectionArgs, sortOrder)
                ?.use { cursor ->
                    val arr = Arguments.createArray()
                    val idCol = cursor.getColumnIndex(CallLog.Calls._ID)
                    val numberCol = cursor.getColumnIndex(CallLog.Calls.NUMBER)
                    val typeCol = cursor.getColumnIndex(CallLog.Calls.TYPE)
                    val dateCol = cursor.getColumnIndex(CallLog.Calls.DATE)
                    val durationCol = cursor.getColumnIndex(CallLog.Calls.DURATION)
                    val nameCol = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME)

                    while (cursor.moveToNext()) {
                        val m = Arguments.createMap()
                        m.putInt("id", if (idCol != -1) cursor.getInt(idCol) else -1)
                        m.putString("number", if (numberCol != -1) cursor.getString(numberCol) else "")
                        m.putInt("type", if (typeCol != -1) cursor.getInt(typeCol) else 0)
                        m.putDouble("date", if (dateCol != -1) cursor.getLong(dateCol).toDouble() else 0.0)
                        m.putInt("duration", if (durationCol != -1) cursor.getInt(durationCol) else 0)
                        val name = if (nameCol != -1) cursor.getString(nameCol) else null
                        m.putString("name", name ?: "Unknown")
                        arr.pushMap(m)
                    }
                    promise.resolve(arr)
                } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERR_CALL_LOG", e)
        }
    }

    @ReactMethod
    fun getCallLogsPage(page: Int, promise: Promise) {
        try {
            val offset = page * PAGE_SIZE

            val projection = arrayOf(
                CallLog.Calls._ID,
                CallLog.Calls.NUMBER,
                CallLog.Calls.TYPE,
                CallLog.Calls.DATE,
                CallLog.Calls.DURATION,
                CallLog.Calls.CACHED_NAME
            )

            val now = System.currentTimeMillis()
            val ninetyDaysMs = 90L * 24 * 60 * 60 * 1000
            val cutoff = now - ninetyDaysMs
            val selection = "${CallLog.Calls.DATE} >= ?"
            val selectionArgs = arrayOf(cutoff.toString())
            val sortOrder = "${CallLog.Calls.DATE} DESC" // <-- NO LIMIT/OFFSET here

            reactApplicationContext.contentResolver
                .query(CallLog.Calls.CONTENT_URI, projection, selection, selectionArgs, sortOrder)
                ?.use { cursor ->
                    val arr = Arguments.createArray()
                    if (cursor.moveToPosition(offset)) {
                        val idCol = cursor.getColumnIndex(CallLog.Calls._ID)
                        val numberCol = cursor.getColumnIndex(CallLog.Calls.NUMBER)
                        val typeCol = cursor.getColumnIndex(CallLog.Calls.TYPE)
                        val dateCol = cursor.getColumnIndex(CallLog.Calls.DATE)
                        val durationCol = cursor.getColumnIndex(CallLog.Calls.DURATION)
                        val nameCol = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME)

                        for (i in 0 until PAGE_SIZE) {
                            if (cursor.isAfterLast) break
                            val m = Arguments.createMap()
                            m.putInt("id", if (idCol != -1) cursor.getInt(idCol) else -1)
                            m.putString("number", if (numberCol != -1) cursor.getString(numberCol) else "")
                            m.putInt("type", if (typeCol != -1) cursor.getInt(typeCol) else 0)
                            m.putDouble("date", if (dateCol != -1) cursor.getLong(dateCol).toDouble() else 0.0)
                            m.putInt("duration", if (durationCol != -1) cursor.getInt(durationCol) else 0)
                            val name = if (nameCol != -1) cursor.getString(nameCol) else null
                            m.putString("name", name ?: "Unknown")
                            arr.pushMap(m)
                            cursor.moveToNext()
                        }
                    }
                    promise.resolve(arr)
                } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERR_PAGE_CALL_LOG", e)
        }
    }

    @ReactMethod
    fun getCallLogsPageWithFilter(page: Int, status: String, fromTsDouble: Double, toTsDouble: Double, promise: Promise) {
        try {
            val fromTs = fromTsDouble.toLong()
            val toTs = toTsDouble.toLong()
            val offset = page * PAGE_SIZE

            val projection = arrayOf(
                CallLog.Calls._ID,
                CallLog.Calls.NUMBER,
                CallLog.Calls.TYPE,
                CallLog.Calls.DATE,
                CallLog.Calls.DURATION,
                CallLog.Calls.CACHED_NAME
            )

            val sel = StringBuilder("${CallLog.Calls.DATE} >= ? AND ${CallLog.Calls.DATE} <= ?")
            val selArgsList = mutableListOf(fromTs.toString(), toTs.toString())

            when (status.lowercase()) {
                "missed" -> {
                    sel.append(" AND ${CallLog.Calls.TYPE} = ?")
                    selArgsList.add(CallLog.Calls.MISSED_TYPE.toString())
                }
                "answered" -> {
                    sel.append(" AND (${CallLog.Calls.TYPE} = ? OR ${CallLog.Calls.TYPE} = ?)")
                    selArgsList.add(CallLog.Calls.INCOMING_TYPE.toString())
                    selArgsList.add(CallLog.Calls.OUTGOING_TYPE.toString())
                }
            }

            val selection = sel.toString()
            val selectionArgs = selArgsList.toTypedArray()
            val sortOrder = "${CallLog.Calls.DATE} DESC" // <-- NO LIMIT/OFFSET here

            reactApplicationContext.contentResolver
                .query(CallLog.Calls.CONTENT_URI, projection, selection, selectionArgs, sortOrder)
                ?.use { cursor ->
                    val arr = Arguments.createArray()
                    if (cursor.moveToPosition(offset)) {
                        val idCol = cursor.getColumnIndex(CallLog.Calls._ID)
                        val numberCol = cursor.getColumnIndex(CallLog.Calls.NUMBER)
                        val typeCol = cursor.getColumnIndex(CallLog.Calls.TYPE)
                        val dateCol = cursor.getColumnIndex(CallLog.Calls.DATE)
                        val durCol = cursor.getColumnIndex(CallLog.Calls.DURATION)
                        val nameCol = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME)

                        for (i in 0 until PAGE_SIZE) {
                            if (cursor.isAfterLast) break
                            val m = Arguments.createMap()
                            m.putInt("id", if (idCol != -1) cursor.getInt(idCol) else -1)
                            m.putString("number", if (numberCol != -1) cursor.getString(numberCol) else "")
                            m.putInt("type", if (typeCol != -1) cursor.getInt(typeCol) else 0)
                            m.putDouble("date", if (dateCol != -1) cursor.getLong(dateCol).toDouble() else 0.0)
                            m.putInt("duration", if (durCol != -1) cursor.getInt(durCol) else 0)
                            val name = if (nameCol != -1) cursor.getString(nameCol) else null
                            m.putString("name", name ?: "Unknown")
                            arr.pushMap(m)
                            cursor.moveToNext()
                        }
                    }
                    promise.resolve(arr)
                } ?: run {
                promise.resolve(Arguments.createArray())
            }
        } catch (e: Exception) {
            promise.reject("ERR_PAGE_CALL_LOG_FILTER", e)
        }
    }

    @ReactMethod
    fun getFilteredCallLogsCount(status: String, fromTsDouble: Double, toTsDouble: Double, promise: Promise) {
        try {
            val fromTs = fromTsDouble.toLong()
            val toTs = toTsDouble.toLong()

            val sel = StringBuilder("${CallLog.Calls.DATE} >= ? AND ${CallLog.Calls.DATE} <= ?")
            val selArgsList = mutableListOf(fromTs.toString(), toTs.toString())

            when (status.lowercase()) {
                "missed" -> {
                    sel.append(" AND ${CallLog.Calls.TYPE} = ?")
                    selArgsList.add(CallLog.Calls.MISSED_TYPE.toString())
                }
                "answered" -> {
                    sel.append(" AND (${CallLog.Calls.TYPE} = ? OR ${CallLog.Calls.TYPE} = ?)")
                    selArgsList.add(CallLog.Calls.INCOMING_TYPE.toString())
                    selArgsList.add(CallLog.Calls.OUTGOING_TYPE.toString())
                }
            }

            val selection = sel.toString()
            val selectionArgs = selArgsList.toTypedArray()

            reactApplicationContext.contentResolver
                .query(CallLog.Calls.CONTENT_URI, null, selection, selectionArgs, null)
                ?.use { cursor ->
                    promise.resolve(cursor.count)
                } ?: run {
                promise.resolve(0)
            }
        } catch (e: Exception) {
            promise.reject("ERR_CALLLOG_COUNT", e)
        }
    }
}
