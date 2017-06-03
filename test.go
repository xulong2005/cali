package main

import (
	"encoding/json"
	"fmt"
	"github.com/Unknwon/GoConfig"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/core"
	"github.com/go-xorm/xorm"
	"github.com/jiangmitiao/cali/app/models"
	_ "github.com/mattn/go-sqlite3"
)

var engine *xorm.Engine

func init() {
	fmt.Println("dbService ok")
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func GetSqliteDbPath() string {
	c, err := goconfig.LoadConfigFile("conf/app.conf")
	if err != nil {
		fmt.Println("读取失败")
		return ""
	} else {
		str, _ := c.GetValue("", "sqlitedb.path")
		return str
	}
}

func ListTableContent(engine xorm.Engine) {
	authors := make([]models.Author, 0)
	engine.Limit(2, 0).Find(&authors)
	authorJosnByte, _ := json.Marshal(authors)
	fmt.Println(string(authorJosnByte))

	books := make([]models.Book, 0)
	engine.Limit(2, 0).Find(&books)
	booksJosnByte, _ := json.Marshal(books)
	fmt.Println(string(booksJosnByte))

}

func DbInit() (bool, error) {
	fmt.Println(GetSqliteDbPath())

	var err error
	engine, err := xorm.NewEngine("sqlite3", GetSqliteDbPath())
	//dataSourceName := username + ":" + password + "@tcp(" + host + ")/" + database + "?charset=utf8"
	//engine, err = xorm.NewEngine("mysql", dataSourceName)
	if err != nil {
		return false, err
	}
	engine.ShowSQL(true)
	engine.Logger().SetLevel(core.LOG_DEBUG)
	err = engine.Ping()
	if err != nil {
		fmt.Println(err)
		return false, err
	}
	engine.Logger().Info("----------创建表----------")

	engine.Logger().Info("----------创建表结束----------")

	engine.Logger().Info("----------插入默认数据----------")

	engine.Logger().Info("----------插入默认数据结束----------")

	ListTableContent(*engine)
	return true, nil

}

func main() {
	DbInit()
}
